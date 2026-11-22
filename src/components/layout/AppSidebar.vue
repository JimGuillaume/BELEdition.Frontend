<script lang="ts">
export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}
</script>

<script setup lang="ts">
import { ChevronRight, File, Folder } from '@lucide/vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'

import { onMounted, ref } from 'vue'
import { GetOeuvres } from '@/services/oeuvreService'

// Arbre du haut : chaque œuvre se déplie pour afficher ses éléments.
// TODO : remplacer les enfants fictifs par les vrais éléments de l'œuvre.
const oeuvres = ref<TreeNode[]>([])

onMounted(async () => {
  const list = await GetOeuvres()
  oeuvres.value = list.map((o) => ({
    id: o.id,
    label: o.titre,
    children: [
      { id: `${o.id}-1`, label: 'Élément 1' },
      { id: `${o.id}-2`, label: 'Élément 2' },
      { id: `${o.id}-3`, label: 'Élément 3' },
    ],
  }))
})

// Second arbre : même structure, contenu à définir.
const secondary = ref<TreeNode[]>([
  {
    id: 'group-1',
    label: 'Groupe 1',
    children: [
      { id: 'group-1-a', label: 'Élément A' },
      { id: 'group-1-b', label: 'Élément B' },
    ],
  },
  {
    id: 'group-2',
    label: 'Groupe 2',
    children: [{ id: 'group-2-a', label: 'Élément A' }],
  },
])

function select(node: TreeNode) {
  // TODO : naviguer vers l'élément sélectionné
  console.log('selected', node)
}
</script>

<template>
  <Sidebar class="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
    <SidebarContent>
      <SidebarGroup
        v-for="(tree, index) in [
          { label: 'Œuvres', nodes: oeuvres },
          { label: '', nodes: secondary },
        ]"
        :key="index"
      >
        <SidebarSeparator v-if="index > 0" class="mb-2" />
        <SidebarGroupLabel v-if="tree.label">{{ tree.label }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="node in tree.nodes" :key="node.id">
              <Collapsible v-if="node.children?.length" v-slot="{ open }">
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton :tooltip="node.label">
                    <ChevronRight
                      class="transition-transform duration-200"
                      :class="{ 'rotate-90': open }"
                    />
                    <Folder />
                    <span>{{ node.label }}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem v-for="child in node.children" :key="child.id">
                      <SidebarMenuSubButton
                        as="button"
                        class="w-full"
                        @click="select(child)"
                      >
                        <File />
                        <span>{{ child.label }}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <SidebarMenuButton v-else :tooltip="node.label" @click="select(node)">
                <File />
                <span>{{ node.label }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
