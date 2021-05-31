<?php

defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function () {
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile('nk_google_map', 'Configuration/TypoScript', 'NK Google Map Configuration');
    }
);
