<script setup>
import { ref, computed } from 'vue'
import { useFluxarStore } from '../stores/fluxarStore'

const store = useFluxarStore()

// Поля форми індивідуального замовлення
const customerName = ref('')
const contactInfo = ref('')
const voltage = ref(12)
const color = ref('Теплий білий (3000K)')
const lengthMeters = ref(3)
const connector = ref('USB-C PD тригер (для павербанка)')
const notes = ref('')

const formErrors = ref({})
const successMessage = ref('')

// Автоматичний розрахунок орієнтовної вартості збірки
const estimatedPrice = computed(() => {
  const basePerMeter = voltage.value === 24 ? 160 : voltage.value === 12 ? 120 : 95
  const triggerCost = connector.value.includes('тригер') ? 110 : 40
  const len = Math.max(0.5, Number(lengthMeters.value) || 0)
  return Math.round(len * basePerMeter + triggerCost)
})

function validateForm() {
  const errors = {}

  if (!customerName.value.trim() || customerName.value.trim().length < 2) {
    errors.customerName = "Введіть ім'я (мінімум 2 символи)."
  }

  if (!contactInfo.value.trim() || contactInfo.value.trim().length < 5) {
    errors.contactInfo = 'Вкажіть коректний номер телефону або @username у Telegram.'
  }

  const len = Number(lengthMeters.value)
  if (isNaN(len) || len < 0.5 || len > 20) {
    errors.lengthMeters = 'Довжина стрічки має бути від 0.5 до 20 метрів.'
  }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

function submitCustomOrder() {
  successMessage.value = ''
  if (!validateForm()) return

  store.addCustomOrder({
    customerName: customerName.value.trim(),
    contactInfo: contactInfo.value.trim(),
    voltage: voltage.value,
    color: color.value,
    lengthMeters: Number(lengthMeters.value),
    connector: connector.value,
    notes: notes.value.trim(),
    estimatedPrice: estimatedPrice.value
  })

  // Очищення полів після успішної відправки
  customerName.value = ''
  contactInfo.value = ''
  notes.value = ''
  formErrors.value = {}
  successMessage.value = 'Індивідуальну заявку збережено! Ми зв’яжемося з вами для підтвердження.'
}
</script>

<template>
  <section class="order-page page-section">
    <div class="container">
      <h1 class="section-title">Замовлення та <span>Кошик</span></h1>

      <div class="order-grid">
        <!-- Блок 1: Форма індивідуального замовлення -->
        <div class="panel">
          <h2 class="panel__title">Індивідуальна збірка LED-системи</h2>
          <p class="panel__sub">
            Потрібна нестандартна довжина або пайка під ваш павербанк? Заповніть параметри нижче.
          </p>

          <form class="form" novalidate @submit.prevent="submitCustomOrder">
            <div class="form__row">
              <div class="form__group">
                <label for="cust-name">Ваше ім'я *</label>
                <input
                  id="cust-name"
                  v-model="customerName"
                  type="text"
                  placeholder="Наприклад: Дмитро"
                />
                <span v-if="formErrors.customerName" class="error-msg">
                  {{ formErrors.customerName }}
                </span>
              </div>

              <div class="form__group">
                <label for="cust-contact">Телефон або Telegram *</label>
                <input
                  id="cust-contact"
                  v-model="contactInfo"
                  type="text"
                  placeholder="+380... або @username"
                />
                <span v-if="formErrors.contactInfo" class="error-msg">
                  {{ formErrors.contactInfo }}
                </span>
              </div>
            </div>

            <div class="form__row">
              <div class="form__group">
                <label for="cust-voltage">Робоча напруга (В)</label>
                <select id="cust-voltage" v-model.number="voltage">
                  <option :value="5">5V (прямий USB)</option>
                  <option :value="9">9V (QC / PD тригер)</option>
                  <option :value="12">12V (PD тригер / акумулятор)</option>
                  <option :value="24">24V (професійна лінія)</option>
                </select>
              </div>

              <div class="form__group">
                <label for="cust-length">Довжина стрічки (м) *</label>
                <input
                  id="cust-length"
                  v-model.number="lengthMeters"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="20"
                />
                <span v-if="formErrors.lengthMeters" class="error-msg">
                  {{ formErrors.lengthMeters }}
                </span>
              </div>
            </div>

            <div class="form__row">
              <div class="form__group">
                <label for="cust-color">Колір світіння</label>
                <select id="cust-color" v-model="color">
                  <option>Теплий білий (3000K)</option>
                  <option>Нейтральний білий (4000K)</option>
                  <option>Холодний білий (6000K)</option>
                  <option>Неоново-блакитний (Cyan)</option>
                  <option>Фіолетовий (Purple)</option>
                  <option>Золотий бурштин (2400K)</option>
                </select>
              </div>

              <div class="form__group">
                <label for="cust-conn">Тип роз'єму / тригера</label>
                <select id="cust-conn" v-model="connector">
                  <option>USB-C PD тригер (для павербанка)</option>
                  <option>USB-A кабель із вимикачем</option>
                  <option>Штекер DC 5.5×2.1</option>
                  <option>Вільні дроти під клеми</option>
                </select>
              </div>
            </div>

            <div class="form__group">
              <label for="cust-notes">Особливі побажання (довжина кабелю живлення, вологозахист IP65 тощо)</label>
              <textarea
                id="cust-notes"
                v-model="notes"
                rows="3"
                placeholder="Наприклад: потрібен кабель 1.5 м від тригера до стрічки та вологозахист IP65..."
              ></textarea>
            </div>

            <div class="price-preview">
              <span>Орієнтовна вартість індивідуальної збірки:</span>
              <strong>{{ estimatedPrice }} грн</strong>
            </div>

            <button type="submit" class="btn btn--primary btn--full">
              Зберегти індивідуальне замовлення
            </button>

            <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
          </form>

          <!-- Список збережених індивідуальних заявок (localStorage) -->
          <div v-if="store.customOrders.length > 0" class="saved-orders">
            <h3>Ваші збережені заявки ({{ store.customOrders.length }})</h3>
            <div
              v-for="order in store.customOrders"
              :key="order.id"
              class="saved-item"
            >
              <div>
                <strong>{{ order.lengthMeters }} м • {{ order.voltage }}V • {{ order.color }}</strong>
                <p>{{ order.connector }} | Замовник: {{ order.customerName }} ({{ order.contactInfo }})</p>
                <p v-if="order.notes" class="saved-item__note">Примітка: {{ order.notes }}</p>
                <span class="saved-item__meta">{{ order.createdAt }} • {{ order.estimatedPrice }} грн</span>
              </div>
              <button
                type="button"
                class="btn btn--danger"
                aria-label="Видалити заявку"
                @click="store.removeCustomOrder(order.id)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Блок 2: Кошик готових товарів -->
        <div class="panel">
          <div class="panel__head">
            <h2 class="panel__title">Кошик готових комплектів</h2>
            <button
              v-if="store.cart.length > 0"
              type="button"
              class="btn btn--danger"
              @click="store.clearCart"
            >
              Очистити
            </button>
          </div>

          <div v-if="store.cart.length === 0" class="empty-cart">
            <p>Ваш кошик поки порожній.</p>
            <RouterLink to="/catalog" class="btn btn--outline">Обрати LED-стрічку в каталозі</RouterLink>
          </div>

          <div v-else class="cart-list">
            <div v-for="item in store.cart" :key="item.id" class="cart-item">
              <div class="cart-item__info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.voltage }}V • {{ item.color }} • {{ item.length }} м</p>
                <span class="cart-item__price">{{ item.price * item.quantity }} грн</span>
              </div>

              <div class="cart-item__controls">
                <button type="button" class="qty-btn" @click="store.updateQuantity(item.id, -1)">−</button>
                <span>{{ item.quantity }}</span>
                <button type="button" class="qty-btn" @click="store.updateQuantity(item.id, 1)">+</button>
                <button
                  type="button"
                  class="btn btn--danger"
                  aria-label="Видалити товар"
                  @click="store.removeFromCart(item.id)"
                >
                  ✕
                </button>
              </div>
            </div>

            <div class="cart-total">
              <span>Разом до сплати:</span>
              <strong>{{ store.cartTotal }} грн</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../assets/styles/variables' as *;

.order-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 26px;
  align-items: start;
}

.panel {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: 24px;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 1.35rem;
    color: $accent-gold;
    margin-bottom: 6px;
  }

  &__sub {
    color: $text-muted;
    font-size: 0.92rem;
    margin-bottom: 20px;
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 0.86rem;
      color: $text-muted;
      font-weight: 600;
    }

    input,
    select,
    textarea {
      background: $bg-input;
      border: 1px solid $border-color;
      color: $text-main;
      padding: 10px 12px;
      border-radius: $radius-md;
      font-size: 0.95rem;
      font-family: inherit;
      width: 100%;

      &:focus {
        border-color: $accent-cyan;
      }
    }
  }
}

.error-msg {
  color: $danger;
  font-size: 0.8rem;
}

.success-msg {
  color: $success;
  background: rgba($success, 0.12);
  border: 1px solid rgba($success, 0.4);
  padding: 10px 14px;
  border-radius: $radius-md;
  font-size: 0.9rem;
}

.price-preview {
  background: $bg-input;
  border: 1px dashed $accent-cyan;
  padding: 12px 16px;
  border-radius: $radius-md;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  span {
    color: $text-muted;
    font-size: 0.92rem;
  }

  strong {
    color: $accent-gold;
    font-size: 1.25rem;
  }
}

.btn--full {
  width: 100%;
}

.saved-orders {
  margin-top: 26px;
  padding-top: 20px;
  border-top: 1px solid $border-color;

  h3 {
    font-size: 1.05rem;
    margin-bottom: 12px;
    color: $accent-cyan;
  }
}

.saved-item {
  background: $bg-input;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  padding: 12px 14px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  p {
    font-size: 0.85rem;
    color: $text-muted;
    margin-top: 3px;
  }

  &__note {
    color: $text-main !important;
  }

  &__meta {
    display: inline-block;
    margin-top: 4px;
    font-size: 0.82rem;
    color: $accent-gold;
    font-weight: 600;
  }
}

.empty-cart {
  text-align: center;
  padding: 32px 12px;
  color: $text-muted;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  background: $bg-input;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  &__info {
    h3 {
      font-size: 1rem;
      margin-bottom: 4px;
    }

    p {
      font-size: 0.84rem;
      color: $text-muted;
    }
  }

  &__price {
    display: inline-block;
    margin-top: 6px;
    font-weight: 700;
    color: $accent-gold;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.qty-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid $border-color;
  background: $bg-card;
  color: $text-main;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: $accent-cyan;
  }
}

.cart-total {
  margin-top: 10px;
  padding-top: 14px;
  border-top: 1px solid $border-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.15rem;

  strong {
    font-size: 1.45rem;
    color: $accent-gold;
  }
}

@media (max-width: 900px) {
  .order-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 550px) {
  .form__row {
    grid-template-columns: 1fr;
  }
}
</style>