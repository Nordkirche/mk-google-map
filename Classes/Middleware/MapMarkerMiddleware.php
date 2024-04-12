<?php

declare(strict_types=1);

namespace Nordkirche\NkGoogleMap\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Http\Response;
use TYPO3\CMS\Core\Http\Stream;
use TYPO3\CMS\Core\Site\Entity\Site;
use TYPO3\CMS\Core\TypoScript\TemplateService;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\RootlineUtility;

class MapMarkerMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $normalizedParams = $request->getAttribute('normalizedParams');
        $uri = $normalizedParams->getRequestUri();

        if (str_starts_with($uri, '/marker')) {
            $data = [];
            $supportedObjects = [];
            $markerResult = '';

            $tsConfig = $this->getTsConfig($request);

            $items = GeneralUtility::trimExplode(',', (string)$request->getQueryParams()['items']);

            $config = !empty($GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['nk_google_map']) ? $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['nk_google_map'] : [];

            foreach (GeneralUtility::trimExplode(',', (string)$config['config_mapping']) as $mapping) {
                [$objectType, $className] = GeneralUtility::trimExplode(':', $mapping);
                $supportedObjects[$objectType] = $className;
            }

            foreach ($items as $item) {
                [$object, $id] = GeneralUtility::trimExplode(':', $item);
                if ($object && $id) {
                    if (isset($supportedObjects[$object])) {
                        $data[$object][] = $id;
                    }
                }
            }

            // Retrieve objects
            foreach ($data as $object => $items) {
                try {
                    $className = $supportedObjects[$object];
                    if (substr($className, 0, 1) == '\\') {
                        $className = substr($className, 1);
                    }
                    $controller = GeneralUtility::makeInstance($className);
                    $controller->setMiddleWareRequest($request);
                    $markerResult .= $controller->retrieveMarkerInfo($items, $tsConfig);
                } catch (\Exception $e) {
                    $markerResult .= $e->getMessage();
                }
            }

            $body = new Stream('php://temp', 'rw');
            $body->write($markerResult);

            return (new Response())
                ->withHeader('content-type', 'text/html; charset=utf-8')
                ->withBody($body)
                ->withStatus(200);
        }
        return $handler->handle($request);
    }

    /**
     * @param $request
     * @return array
     */
    private function getTsConfig($request)
    {
        /** @var Site $site */
        $site = $request->getAttribute('site');

        /** @var RootlineUtility $rootlineUtility */
        $rootlineUtility = GeneralUtility::makeInstance(RootlineUtility::class, $site->getRootPageId());
        $rootline = $rootlineUtility->get();

        /** @var TemplateService $templateService */
        $templateService = GeneralUtility::makeInstance(TemplateService::class);
        $templateService->tt_track = 0;
        $templateService->runThroughTemplates($rootline);
        $templateService->generateConfig();

        $typoScriptService = GeneralUtility::makeInstance(TypoScriptService::class);
        return $typoScriptService->convertTypoScriptArrayToPlainArray($templateService->setup);
    }
}
