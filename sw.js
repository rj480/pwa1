importScripts('sw-utils.js');

const CACHE_ESTATICO = 'static-v2';
const CACHE_DINAMICO = 'dymanic-v1';
const CACHE_INMUTABLE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'

];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(CACHE_ESTATICO)
        .then(cache => {
            return cache.addAll(APP_SHELL);
        });

    const cacheInmutable = caches.open(CACHE_INMUTABLE)
        .then(cache => {
            return cache.addAll(APP_SHELL_INMUTABLE);
        });

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
});

self.addEventListener('activate', e => {

    const respuesta = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if (key !== CACHE_ESTATICO && key.includes('static')) {
                    return caches.delete(key);
                }
            });
        });

    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request)
        .then(res => {
            if (res) {
                return res;
            } else {

               return fetch(e.request)
                    .then(newResp => {
                        return actualizarCacheDinamico(CACHE_DINAMICO,e.request,newResp);
                    });
                
            }
        });

    e.respondWith(respuesta);
});