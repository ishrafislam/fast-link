<script setup lang="ts">
</script>

<template>
  <main class="auth-shell">
    <section class="hero-card">
      <p class="eyebrow">Single-user dashboard</p>
      <h1>Connect GitHub and browse every repo you can access</h1>
      <p>
        Fast Link pulls your personal and organization repositories into one searchable dashboard,
        including private repositories available through your GitHub account.
      </p>

      <ul class="feature-list">
        <li>Personal + organization repository discovery</li>
        <li>Client-side search, filters, and sorting</li>
        <li>Secure server-side token handling with HTTP-only cookies</li>
      </ul>

      <a class="primary-button" href="/api/auth/github/login">Sign in with GitHub</a>
    </section>
  </main>
</template>
