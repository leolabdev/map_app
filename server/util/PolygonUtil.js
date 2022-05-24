/**
 * The class provides functionality for working with the GeoJSON polygon or multipolygon objects
 */
class PolygonUtil {
    INF = 10000;

    /**
     * The method determines does the given lines (p1, q1) and (p2, q2) intersects
     * @param {Array.<number>=} p1 start point coordinates of the first line in form [lon, lat]
     * @param {Array.<number>=} q1 end point of the first line in form [lon, lat]
     * @param {Array.<number>=} p2 start point of the second line in form [lon, lat]
     * @param {Array.<number>=} q2 end point of the second line in form [lon, lat]
     * @returns {boolean} true if the lines intersects, false if not
     */
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

    /**
     * The method determines is the given point inside the given polygon
     * @param {Array.<Array.<number>>} polygon coordinates of the polygon points in the form [lon, lat]
     * @param {Array.<number>} p point coordinates in the form [lon, lat]
     * @returns {boolean} true if the point is inside the polygon, false if not
     */
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

    /**
     * The method removes all the GeoJSON polygon objects points coordinates, which contain at least one of the given points.
     * The method is very specific and used to get polygons, which can be avoided in routing.
     * @param {Object} polygon GeoJSON polygon or multipolygon object
     * @param {Array.<Array.<number>>} points array of the points coordinates in the form [lon, lat]
     * @returns {null|Object} given polygon object without polygon coordinates, which contain at least one of the given points.
     */
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

    /**
     * The method generates square form GeoJSON polygon object's coordinates
     * @param {Array.<number>} centerCoordinates coordinates of the square center in the form [lon, lat]
     * @param {number} radius radius of the square
     * @returns {Array.<Array.<number>>|null} coordinates of the square object
     */
    generateSquarePolygonCoordinates(centerCoordinates, radius){
        if(centerCoordinates != null && centerCoordinates.length > 1){
            const result = [[]];

            const x1 = centerCoordinates[0] - radius;
            const x2 = centerCoordinates[0] + radius;
            const y1 = centerCoordinates[1] - radius;
            const y2 = centerCoordinates[1] + radius;

            result[0].push([x1, y1]);
            result[0].push([x2, y1]);
            result[0].push([x2, y2]);
            result[0].push([x1, y2]);
            result[0].push([x1, y1]);

            return result;
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