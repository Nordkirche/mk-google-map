<?php

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
defined('TYPO3') || die('Access denied.');

call_user_func(
    function () {
        ExtensionManagementUtility::addStaticFile('nk_google_map', 'Configuration/TypoScript', 'NK Google Map Configuration');
    }
);
