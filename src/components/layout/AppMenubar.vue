<script setup lang="ts">
import { LogOut } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { SidebarTrigger } from '@/components/ui/sidebar'

function onLogout() {
  // TODO : brancher l'authentification
  console.log('logout')
}
</script>

<template>
  <header
    class="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 flex h-(--header-height) w-full shrink-0 items-center gap-2 border-b px-4 backdrop-blur"
  >
    <SidebarTrigger class="-ml-1" />

    <Menubar class="border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger>Profil</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Mon profil</MenubarItem>
          <MenubarItem>Paramètres</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Œuvres</MenubarTrigger>
        <MenubarContent>
          <MenubarItem as-child>
            <RouterLink to="/oeuvres">Toutes les œuvres</RouterLink>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Nouvelle œuvre</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Univers</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Tous les univers</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Nouvel univers</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>

    <Button variant="ghost" size="sm" class="ml-auto" @click="onLogout">
      <LogOut />
      <span>Déconnexion</span>
    </Button>
  </header>
</template>
