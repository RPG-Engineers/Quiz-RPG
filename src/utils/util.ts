import { TipoCaracteristica } from "../types";

export function getTipo(tipo : TipoCaracteristica) {
    switch (tipo) {
        case TipoCaracteristica.CLASSE:
            return "classe"
            break;
        case TipoCaracteristica.BACKGROUND:
            return "background"
            break;
        case TipoCaracteristica.RACA:
            return "raça"
            break;
    }
}