import { method } from 'bluebird'
import {
  IExtensionContext,
  IGame,
  IDiscoveryResult,
} from 'vortex-api/lib/types/api'

import findGameByAppId from './findGameByAppId'

export interface BaseGameInfo
  extends Pick<
    IGame,
    'id' | 'name' | 'requiredFiles' | 'executable' | 'supportedTools'
  > {
  // This is optional in `IGame` but vortex seems to crash without it.
  logo: string
  steamAppId?: string
  gogAppId?: string
  setup?: (
    discovery: IDiscoveryResult,
    context: IExtensionContext,
  ) => Promise<void>
}

function createGame(info: BaseGameInfo, context: IExtensionContext) {
  const environment: IGame['environment'] = {}
  if (info.steamAppId) {
    environment['SteamAPPId'] = info.steamAppId
  }

  const game: IGame = {
    ...info,

    queryPath: findGameByAppId(info),
    queryModPath: () => '.',
    setup: info.setup
      ? method((discovery: IDiscoveryResult) =>
          info.setup?.(discovery, context),
        )
      : undefined,

    mergeMods: true,

    environment,
    details: {
      steamAppId: info.steamAppId,
      gogAppId: info.gogAppId,
    },
  }

  return game
}

export default createGame
