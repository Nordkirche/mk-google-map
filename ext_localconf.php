<?php

defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function () {
        if (!is_array($GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_nkgooglemaps'])) {
            $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_nkcbase'] = [];
        }

        if (!isset($GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_nkgooglemaps']['frontend'])) {
            $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations']['tx_nkgooglemaps'] = [
                'frontend' => \TYPO3\CMS\Core\Cache\Frontend\VariableFrontend::class,
                'options' => [
                    'defaultLifetime' => 86400 * 2
                ],
                'groups' => ['nk_google_map']
            ];
        }
    }
);
