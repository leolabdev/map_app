class PolygonUtil {
    INF = 10000;

    //points in the form [lon, lat]
    doIntersect(p1, q1, p2, q2) {
        const o1 = orientation(p1, q1, p2);
        const o2 = orientation(p1, q1, q2);
        const o3 = orientation(p2, q2, p1);
        const o4 = orientation(p2, q2, q1);

        if (o1 !== o2 && o3 !== o4)
            return true;

        if (o1 === 0 && onSegment(p1, p2, q1))
            return true;

        if (o2 === 0 && onSegment(p1, q2, q1))
            return true;

        if (o3 === 0 && onSegment(p2, p1, q2))
            return true;

        if (o4 === 0 && onSegment(p2, q1, q2))
            return true;

        return false;
    }

    //polygon in form [ [lon, lat], [lon,lat] ]
    //points in form [lon, lat]
    isInside(polygon, p) {
        const pointsCount = polygon.length;
        if (pointsCount < 3)
            return false;

        const extreme = [this.INF, p[1]];

        let count = 0, i = 0;
        do{
            let next = (i + 1) % pointsCount;

            if (this.doIntersect(polygon[i], polygon[next], p, extreme)){
                if (orientation(polygon[i], p, polygon[next]) === 0)
                    return onSegment(polygon[i], p, polygon[next]);

                count++;
            }
            i = next;
        } while (i !== 0);

        return (count % 2 === 1);
    }

    getPolygonWithoutPointsInside(polygon, points){
        if(polygon != null){
            //check is some the points are inside in the avoided area = this area can not be avoided
            if(polygon.type === "Polygon"){
                const polygonArea = polygon.coordinates[0];
                for(let i=0; i<points.length; i++){
                    const isPointInside = this.isInside(polygonArea, points[i]);
                    if(isPointInside){
                        polygon.coordinates[0] = [];
                        break;
                    }
                }
            } else if(polygon.type === "MultiPolygon"){
                const polygons = polygon.coordinates;
                for(let i=0; i<polygons.length; i++){
                    if(polygons[i] != null){
                        const polygonArea = polygons[i][0];
                        for(let j=0; j<points.length; j++){
                            const isPointInside = this.isInside(polygonArea, points[j]);
                            if(isPointInside){
                                polygons[i][0] = [];
                                break;
                            }
                        }
                    } else{
                        polygons[i] = [[]];
                    }
                }
            }

            return polygon;
        }

        return null;
    }
}
module.exports = PolygonUtil;

//points in the form [lon, lat]
function onSegment(p, q, r) {
    if (q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1])){
        return true;
    }

    return false;
}

//points in the form [lon, lat]
function orientation(p, q, r) {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);

    if (val === 0)
        return 0; //collinear

    return (val > 0) ? 1 : 2; //clock wise or counter clock wise
}