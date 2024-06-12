function canISeeMapPage  (){
    return true;
}

function canISeeAuthPages  ()  {
    return true;
}

export const userPermissions = {
    canISeeMapPage,
    canISeeAuthPages,
}



export const useUserPermissions = () => {
    /**
     * Checks if the user has the specified permission.
     * @param {"canISeeMapPage" | "canISeeAuthPages"} permission - The name of the permission.
     * @returns {boolean} - Returns true if the permission exists and is granted.
     */
    function canI (permission) {
        const check = userPermissions[permission];
        return check ? check() : false;
    }

    return {canI};
}


