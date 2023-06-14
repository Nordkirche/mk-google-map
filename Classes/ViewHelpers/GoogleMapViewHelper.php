<?php
namespace Nordkirche\NkGoogleMap\ViewHelpers;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Fluid\View\StandaloneView;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

class GoogleMapViewHelper extends AbstractViewHelper
{
    /**
     * @var bool
     */
    protected $escapeOutput = false;

    /**
     * Default configuration
     * @var array
     */
    protected $configuration = [
        'iconBasePath' => '/typo3conf/ext/nkc_base/Resources/Public/MapIcons/',
        'style' => ''
    ];

    /**
     * @return void
     */
    public function initializeArguments()
    {
        $this->registerArgument('requestUri', 'string', 'Request Uri', false, '');
        $this->registerArgument('streamUri', 'string', 'Stream Uri', false, '');
        $this->registerArgument('markers', 'array', 'Marker array', false, []);
        $this->registerArgument('configuration', 'array', 'Configuration array', false, []);
        $this->registerArgument('fitOnClick', 'string', 'Fit on click', false, '');

        parent::initializeArguments();
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function render()
    {
        $view = $this->getStandaloneView();

        $this->mergeConfiguration();

        // Unique identifier
        $mapId = uniqid();

        $view->assignMultiple([
            'requestUri' 	=> $this->getRequestUri(),
            'streamUri'     => $this->getStreamUri(),
            'markers'		=> $this->getMarkerJson(),
            'configuration'	=> $this->getConfiguration(),
            'mapId'			=> $mapId,
            'fitOnClick'    => $this->getFitOnClick(),
            'settings'      => GeneralUtility::removeDotsFromTS($GLOBALS['TSFE']->tmpl->setup['plugin.']['tx_nkgooglemap_pi1.']['settings.']),
            'jsCode'        => $this->buildJsCode(
                                    $this->getRequestUri(),
                                    $this->getStreamUri(),
                                    $this->getMarkerJson(),
                                    $this->getConfiguration(),
                                    $mapId,
                                    $this->getFitOnClick())
        ]);

        return $view->render();
    }

    /**
     * @return void
     */
    private function mergeConfiguration()
    {
        \TYPO3\CMS\Core\Utility\ArrayUtility::mergeRecursiveWithOverrule(
            $this->configuration,
            (array)$this->arguments['configuration'],
            true
        );
    }


    /**
     * @return mixed|\Psr\Log\LoggerAwareInterface|\TYPO3\CMS\Core\SingletonInterface|StandaloneView
     * @throws \Exception
     */
    private function getStandaloneView()
    {
        $view = GeneralUtility::makeInstance(StandaloneView::class);

        $settings = GeneralUtility::removeDotsFromTS($GLOBALS['TSFE']->tmpl->setup);

        if (isset($settings['plugin']['tx_nkgooglemap_pi1']['view'])) {
            $view->setTemplateRootPaths($settings['plugin']['tx_nkgooglemap_pi1']['view']['templateRootPaths']);
            $view->setLayoutRootPaths($settings['plugin']['tx_nkgooglemap_pi1']['view']['layoutRootPaths']);
            $view->setPartialRootPaths($settings['plugin']['tx_nkgooglemap_pi1']['view']['partialRootPaths']);
            $view->setTemplate('Index');
        } else {
            throw new \Exception('TypoScript configuration missing. Please include static TS template.', 1678633790);
        }

        return $view;
    }

    /**
     * @return string
     */
    public function getRequestUri()
    {
        return $this->arguments['requestUri'];
    }

    /**
     * @return string
     */
    public function getStreamUri()
    {
        return $this->arguments['streamUri'];
    }

    /**
     * @return array
     */
    public function getMarkers(): array
    {
        return $this->arguments['markers'];
    }

    /**
     * @return string
     */
    public function getFitOnClick(): string
    {
        return $this->arguments['fitOnClick'];
    }

    /**
     * @return string
     */
    public function getMarkerJson(): string
    {
        return json_encode($this->getMarkers());
    }

    /**
     * @return array
     */
    public function getConfiguration(): array
    {
        return $this->configuration;
    }

    /**
     * @param $requestUri
     * @param $streamUri
     * @param $markers
     * @param $configuration
     * @param $mapId
     * @param $fitOnClick
     * @return string
     */
    private function buildJsCode($requestUri, $streamUri, $markers, $configuration, $mapId, $fitOnClick)
    {
        $configuration['requestId'] = !empty($configuration['requestId']) ? $configuration['requestId'] : '';
        $configuration['pagination'] = !empty($configuration['pagination']) ? $configuration['pagination']: '';
        $configuration['iconBasePath'] = !empty($configuration['iconBasePath']) ? $configuration['iconBasePath']: '';
        $configuration['lat'] = !empty($configuration['lat']) ? $configuration['lat']: '';
        $configuration['lon'] = !empty($configuration['lon']) ? $configuration['lon']: '';
        $configuration['center'] = !empty($configuration['center']) ? $configuration['center']: false;

        $code = "
        <script>
                if (undefined === gmapConfig) {
                    var gmapConfig = [];
                }

                gmapConfig['$mapId'] = [];
                gmapConfig['$mapId']['markers'] = $markers;
                gmapConfig['$mapId']['requestId'] = '$configuration[requestId]';
                gmapConfig['$mapId']['requestUri'] = '$requestUri';
                gmapConfig['$mapId']['streamUri'] = '$streamUri';
                gmapConfig['$mapId']['pagination'] = '$configuration[pagination]';
                gmapConfig['$mapId']['center'] = [];
                gmapConfig['$mapId']['fitOnClick'] = '$fitOnClick';
				gmapConfig['$mapId']['iconBase'] = '$configuration[iconBasePath]';
        ";

        if ($configuration['center'] == '1') {
            $code .= "
                gmapConfig['$mapId']['center']['mode'] = 'fixed';
                gmapConfig['$mapId']['center']['lat'] = '$configuration[lat]';
                gmapConfig['$mapId']['center']['lon'] = '$configuration[lon]';
            ";
        } else {
            if ($configuration['center']== '2') {
                $code .= "gmapConfig['$mapId']['center']['mode'] = 'user';";
            } else {
                $code .= "gmapConfig['$mapId']['center']['mode'] = 'auto';";
            }
        }

        $code .= '</script>';

        return $code;
    }
}
