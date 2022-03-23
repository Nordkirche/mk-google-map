<?php

/**
 * Definitions for middlewares provided by EXT:nk_google_map
 */

return [
    'frontend' => [
        'nordkirche/nk_google_map/marker' => [
            'target' => \Nordkirche\NkGoogleMap\Middleware\MapMarkerMiddleware::class,
            'before' => [
                'typo3/cms-frontend/base-redirect-resolver'
            ]
        ],
    ],
];
