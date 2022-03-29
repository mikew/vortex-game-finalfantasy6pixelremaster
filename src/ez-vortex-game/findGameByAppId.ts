import { method } from 'bluebird'
import { util } from 'vortex-api'

import { BaseGameInfo } from './createGame'

function findGameByAppId(info: BaseGameInfo) {
  const validAppIds = [info.gogAppId, info.steamAppId].filter(
    Boolean,
  ) as string[]

  if (validAppIds.length === 0) {
    return undefined
  }

  return method(async () => {
    const game = await util.GameStoreHelper.findByAppId(validAppIds)

    return game.gamePath
  })
}

export default findGameByAppId
