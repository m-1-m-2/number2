
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/myAccount', component: () => import('pages/myAccount.vue') },
      {
        path: '/inHouse',
        component: () => import('pages/inHouse.vue'),
        children: [
          { path: '/inHouse/dice', component: () => import('pages/inHouseGame/diceGame.vue') },
          { path: '/inHouse/spacedice', component: () => import('pages/inHouseGame/spacediceGame.vue') },
          { path: '/inHouse/limbo', component: () => import('pages/inHouseGame/limboGame.vue') },
          { path: '/inHouse/coinflip', component: () => import('pages/inHouseGame/coinflipGame.vue') },
          { path: '/inHouse/plinko', component: () => import('pages/inHouseGame/plinkoGame.vue') },
          { path: '/inHouse/crash', component: () => import('pages/inHouseGame/crashGame.vue') },
          { path: '/inHouse/mines', component: () => import('pages/inHouseGame/minesGame.vue') },
          { path: '/inHouse/ring', component: () => import('pages/inHouseGame/ringGame.vue') },
          { path: '/inHouse/cryptos', component: () => import('pages/inHouseGame/cryptosGame.vue') },
          { path: '/inHouse/triple', component: () => import('pages/inHouseGame/tripleGame.vue') },
          { path: '/inHouse/furywild', component: () => import('pages/inHouseGame/furywildGame.vue') },
          { path: '/inHouse/tower', component: () => import('pages/inHouseGame/towerGame.vue') },
          { path: '/inHouse/hilo', component: () => import('pages/inHouseGame/hiloGame.vue') },
        ]
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
