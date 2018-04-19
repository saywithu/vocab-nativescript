import { Routes } from "@angular/router";

export function buildRoutes(path, component): Routes {
    return [
        {
            path,
            component
        }
    ];
}
