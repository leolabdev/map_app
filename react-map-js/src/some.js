function LeafletgeoSearchStart() {


    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({

            provider,
            marker: {
                icon

            },
        });
        map.addControl(searchControl);
        function searchEventHandler(result) {
            setStart(result.location.x, result.location.y)
            console.log(start);
        }

        map.on('geosearch/showlocation', searchEventHandler);


        // console.log("h", searchControl.provider)
        return () => map.removeControl(searchControl);
    }, []);

    return null;

}

function LeafletgeoSearchEnd() {


    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({

            provider,
            marker: {
                icon

            },
        });
        map.addControl(searchControl);
        function searchEventHandler(result) {
            setStart(result.location.x, result.location.y)
            console.log(start);
        }

        map.on('geosearch/showlocation', searchEventHandler);


        // console.log("h", searchControl.provider)
        return () => map.removeControl(searchControl);
    }, []);

    return null;
}
