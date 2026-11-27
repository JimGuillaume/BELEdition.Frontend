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

import { computed, onMounted, ref } from 'vue'
import { useOeuvres } from '@/composables/useOeuvres'

// Arbre du haut : chaque œuvre se déplie pour afficher ses éléments.
// Liste partagée avec la page d'aperçu : suppressions et modifications s'y reflètent.
// TODO : remplacer les enfants fictifs par les vrais éléments de l'œuvre.
const { oeuvres: oeuvreList, fetchOeuvres } = useOeuvres()

onMounted(fetchOeuvres)

const oeuvres = computed<TreeNode[]>(() =>
  oeuvreList.value.map((o) => ({
    id: o.id,
    label: o.titre,
    children: [
      { id: `${o.id}-1`, label: 'Élément 1' },
      { id: `${o.id}-2`, label: 'Élément 2' },
      { id: `${o.id}-3`, label: 'Élément 3' },
    ],
  })),
)

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

const selectedId = ref<string | null>(null)

// Couleur principale du thème pour l'élément sélectionné
const activeClass =
  'data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary/90 data-active:hover:text-sidebar-primary-foreground data-active:[&>svg]:text-sidebar-primary-foreground'

function select(node: TreeNode) {
  selectedId.value = node.id
  // TODO : naviguer vers l'élément sélectionné
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
                        :class="['w-full', activeClass]"
                        :is-active="selectedId === child.id"
                        @click="select(child)"
                      >
                        <File />
                        <span>{{ child.label }}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <SidebarMenuButton
                v-else
                :tooltip="node.label"
                :class="activeClass"
                :is-active="selectedId === node.id"
                @click="select(node)"
              >
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
