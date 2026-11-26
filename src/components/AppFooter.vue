<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div>
        <p class="footer__brand">FLUXAR — Автономні світлодіодні системи</p>
        <p class="footer__sub">Сучасні LED-рішення 5V, 9V, 12V та 24V для дому, роботи та комфорту.</p>
      </div>
      <div class="footer__links">
        <RouterLink to="/">Головна</RouterLink>
        <RouterLink to="/catalog">Каталог</RouterLink>
        <RouterLink to="/custom-order">Індивідуальне замовлення</RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '../assets/styles/variables' as *;

.footer {
  background-color: $bg-card;
  border-top: 1px solid $border-color;
  padding: 28px 0;
  margin-top: auto;

  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  &__brand {
    font-weight: 700;
    color: $accent-gold;
    margin-bottom: 4px;
  }

  &__sub {
    color: $text-muted;
    font-size: 0.9rem;
  }

  &__links {
    display: flex;
    gap: 18px;
    color: $text-muted;
    font-size: 0.92rem;

    a:hover {
      color: $accent-cyan;
    }
  }
}
</style>