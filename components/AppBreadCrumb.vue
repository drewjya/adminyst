<script setup lang="ts"></script>

<template>
  <Breadcrumb class="md:flex hidden">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <a href="#" class="font-medium">Dashboard</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <a href="#" class="font-medium">Orders</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage class="font-medium">Recent Orders</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<style scoped></style>
