<?php

use Nordkirche\NkGoogleMap\Middleware\MapMarkerMiddleware;

/**
 * Definitions for middlewares provided by EXT:nk_google_map
 */
return [
    'frontend' => [
        'nordkirche/nk_google_map/marker' => [
            'target' => MapMarkerMiddleware::class,
            'before' => [
                'typo3/cms-frontend/base-redirect-resolver',
            ],
        ],
    ],
];
