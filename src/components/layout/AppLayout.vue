<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppMenubar from '@/components/layout/AppMenubar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
</script>

<template>
  <div class="[--header-height:3.5rem]">
    <SidebarProvider class="flex flex-col">
      <AppMenubar />

      <div class="flex flex-1">
        <AppSidebar />

        <SidebarInset>
          <RouterView />
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>
</template>
