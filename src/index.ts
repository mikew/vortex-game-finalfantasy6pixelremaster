import * as path from 'path'

import { log } from 'vortex-api'
import { ExtensionInit } from 'vortex-api/lib/types/Extension'

import checkForRequiredToolSha256 from './ez-vortex-game/checkForRequiredToolSha256'
import checkForRequiredToolStat from './ez-vortex-game/checkForRequiredToolStat'
import createGame, { BaseGameInfo } from './ez-vortex-game/createGame'

const gameInfo: BaseGameInfo = {
  name: 'Final Fantasy 6 Pixel Remaster',
  logo: 'gameart.jpg',
  id: 'FinalFantasy6PixelRemaster',
  requiredFiles: ['FINAL FANTASY VI.exe'],
  executable: () => 'FINAL FANTASY VI.exe',

  steamAppId: '1173820',

  setup: async (discovery, context) => {
    await checkForRequiredToolStat({
      context,
      discovery,
      name: 'Memoria FF6',
      url: 'https://github.com/Albeoris/Memoria.FFPR',
      paths: [path.join('BepInEx', 'plugins', 'Memoria.FF6.dll')],
    })

    await checkForRequiredToolStat({
      context,
      discovery,
      name: 'BepInEx',
      url: 'https://github.com/Albeoris/Memoria.FFPR',
      paths: [path.join('BepInEx', 'core', 'BepInEx.Core.dll')],
    })

    await checkForRequiredToolSha256({
      context,
      discovery,
      name: 'UnityPlayer.dll',
      path: 'UnityPlayer.dll',
      url: 'https://www.dropbox.com/s/pyqpoxpl7i4i67a/UnityPlayer.7z',
      hashes: [
        'F1B5D1110914CEBEF9D31A935239262342DEBDE78115D90F48C640CD39673CBE',
      ],
    })
  },
}

const main: ExtensionInit = (context) => {
  context.once(() => {
    log('debug', `Loaded plugin for ${gameInfo.name}`)
  })

  context.registerGame(createGame(gameInfo, context))

  return true
}

export default main
