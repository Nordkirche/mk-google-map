<?php

namespace Nordkirche\NkGoogleMap\ViewHelpers\Widget;

use Nordkirche\NkGoogleMap\ViewHelpers\Widget\Controller\GoogleMapController;
use TYPO3\CMS\Fluid\Core\Widget\AbstractWidgetViewHelper;

/**
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
/**
 * This ViewHelper renders a google map
 */
class GoogleMapViewHelper extends AbstractWidgetViewHelper
{
    /**
     * @var GoogleMapController
     * @TYPO3\CMS\Extbase\Annotation\Inject
     */
    protected $controller;

    public function initializeArguments()
    {
        $this->registerArgument('requestUri', 'string', 'Request Uri', false, '');
        $this->registerArgument('streamUri', 'string', 'Stream Uri', false, '');
        $this->registerArgument('markers', 'array', 'Marker array', false, []);
        $this->registerArgument('configuration', 'array', 'Configuration array', false, []);
        $this->registerArgument('fitOnClick', 'string', 'Fit on click', false, '');
    }

    /**
     * @return \TYPO3\CMS\Extbase\Mvc\ResponseInterface
     */
    public function render()
    {
        return $this->initiateSubRequest();
    }
}
