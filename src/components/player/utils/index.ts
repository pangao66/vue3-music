import type { InjectionKey } from 'vue'
import type { PlayerContext } from "@/components/player/types";

export const playerSymbolKey: InjectionKey<PlayerContext> = Symbol('collapseContextKey')
