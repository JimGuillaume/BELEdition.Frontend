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

defineProps<{
  oeuvres: TreeNode[]
  secondary: TreeNode[]
}>()

const emit = defineEmits<{ select: [node: TreeNode] }>()
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
                        @click="emit('select', child)"
                      >
                        <File />
                        <span>{{ child.label }}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <SidebarMenuButton v-else :tooltip="node.label" @click="emit('select', node)">
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
