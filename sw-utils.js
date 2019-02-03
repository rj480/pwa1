   function actualizarCacheDinamico(dynamicaCache, req, res) {

    if (res.ok) {

        return caches.open(dynamicaCache)
            .then(cache => {
                cache.put(req, res.clone());
                return res.clone();
            })
    }
};




