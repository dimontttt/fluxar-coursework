<script setup>
import { ref } from 'vue'
import { useFluxarStore } from '../stores/fluxarStore'

const store = useFluxarStore()
const logoError = ref(false)
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="header__logo">
        <img
          v-if="!logoError"
          src="/images/logo.png"
          alt="Логотип FLUXAR"
          class="header__logo-img"
          @error="logoError = true"
        />
        <span class="header__logo-text">FLUXAR</span>
      </RouterLink>

      <nav class="header__nav" aria-label="Головна навігація">
        <RouterLink to="/" class="header__link">Головна</RouterLink>
        <RouterLink to="/catalog" class="header__link">Каталог LED</RouterLink>
        <RouterLink to="/custom-order" class="header__link header__link--order">
          Замовлення / Кошик
          <span v-if="store.cartCount > 0" class="header__badge">
            {{ store.cartCount }}
          </span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '../assets/styles/variables' as *;

.header {
  background-color: rgba($bg-card, 0.95);
  border-bottom: 1px solid $border-color;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 70px;
    gap: 16px;
    flex-wrap: wrap;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__logo-img {
    height: 38px;
    width: auto;
    object-fit: contain;
  }

  &__logo-text {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 2px;
    background: linear-gradient(90deg, $accent-cyan, $accent-gold);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  &__link {
    font-weight: 600;
    color: $text-muted;
    padding: 6px 10px;
    border-radius: 8px;
    transition: color $transition, background $transition;

    &:hover,
    &.router-link-active {
      color: $accent-cyan;
      background: rgba($accent-cyan, 0.08);
    }

    &--order {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba($accent-purple, 0.6);
      color: $text-main;

      &.router-link-active {
        border-color: $accent-cyan;
      }
    }
  }

  &__badge {
    background: $accent-gold;
    color: #1D1F21;
    font-size: 0.78rem;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 999px;
  }
}

@media (max-width: 600px) {
  .header__inner {
    justify-content: center;
  }
  .header__nav {
    gap: 10px;
    justify-content: center;
  }
}
</style>