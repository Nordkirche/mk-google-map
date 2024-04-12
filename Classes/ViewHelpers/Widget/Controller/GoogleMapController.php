<?php

namespace Nordkirche\NkGoogleMap\ViewHelpers\Widget\Controller;

use TYPO3\CMS\Core\Utility\ArrayUtility;
use TYPO3\CMS\Fluid\Core\Widget\AbstractWidgetController;

class GoogleMapController extends AbstractWidgetController
{
    /**
     * @var string
     */
    protected $requestUri = '';

    /**
     * @var string
     */
    protected $streamUri = '';

    /**
     * @var array
     */
    protected $markers = [];

    /**
     * @var array
     */
    protected $configuration = [
        'iconBasePath' => '/typo3conf/ext/nkc_base/Resources/Public/MapIcons/',
        'style' => '',
    ];

    /**
     * @var string
     */
    protected $fitOnClick = '';

    /**
     * @return string
     */
    public function getRequestUri()
    {
        return $this->widgetConfiguration['requestUri'];
    }

    /**
     * @return string
     */
    public function getStreamUri()
    {
        return $this->widgetConfiguration['streamUri'];
    }

    /**
     * @return array
     */
    public function getMarkers(): array
    {
        return $this->widgetConfiguration['markers'];
    }

    /**
     * @return string
     */
    public function getFitOnClick(): string
    {
        return $this->widgetConfiguration['fitOnClick'];
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
     * Initialize the action and get correct configuration
     */
    public function initializeAction()
    {
        ArrayUtility::mergeRecursiveWithOverrule(
            $this->configuration,
            (array)$this->widgetConfiguration['configuration'],
            true
        );
    }

    /**
     * Main action
     */
    public function indexAction()
    {
        // Unique identifier
        $mapId = uniqid();

        $this->view->assignMultiple([
            'requestUri' 	=> $this->getRequestUri(),
            'streamUri'     => $this->getStreamUri(),
            'markers'		=> $this->getMarkerJson(),
            'configuration'	=> $this->getConfiguration(),
            'mapId'			=> $mapId,
            'fitOnClick'    => $this->getFitOnClick(),
            'jsCode'        => $this->buildJsCode($this->getRequestUri(), $this->getStreamUri(), $this->getMarkerJson(), $this->getConfiguration(), $mapId, $this->getFitOnClick()),
        ]);
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
        $code = "
        <script language=\"JavaScript\">
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
            if ($configuration['center'] == '2') {
                $code .= "gmapConfig['$mapId']['center']['mode'] = 'user';";
            } else {
                $code .= "gmapConfig['$mapId']['center']['mode'] = 'auto';";
            }
        }

        $code .= '</script>';

        return $code;
    }
}
