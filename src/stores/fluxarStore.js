import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useFluxarStore = defineStore('fluxar', () => {
  // Стан каталогу товарів
  const products = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Кошик (завантажуємо з localStorage)
  const cart = ref(JSON.parse(localStorage.getItem('fluxar_cart') || '[]'))

  // Індивідуальні замовлення (завантажуємо з localStorage)
  const customOrders = ref(JSON.parse(localStorage.getItem('fluxar_custom_orders') || '[]'))

  // Автозбереження в localStorage при змінах
  watch(cart, (newVal) => {
    localStorage.setItem('fluxar_cart', JSON.stringify(newVal))
  }, { deep: true })

  watch(customOrders, (newVal) => {
    localStorage.setItem('fluxar_custom_orders', JSON.stringify(newVal))
  }, { deep: true })

  // Асинхронне завантаження товарів
  async function loadProducts() {
    if (products.value.length > 0) return
    isLoading.value = true
    error.value = null

    try {
      // Невелика затримка (350 мс), щоб на демонстрації було видно індикатор Loading
      await new Promise((resolve) => setTimeout(resolve, 350))
      const response = await fetch('/data/products.json')
      if (!response.ok) {
        throw new Error(`Помилка завантаження даних (HTTP ${response.status})`)
      }
      products.value = await response.json()
    } catch (err) {
      error.value = err.message || 'Не вдалося завантажити каталог товарів.'
    } finally {
      isLoading.value = false
    }
  }

  // Отримання одного товару за ID
  function getProductById(id) {
    return products.value.find((item) => item.id === Number(id))
  }

  // Дії з кошиком
  function addToCart(product) {
    const existing = cart.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        color: product.color,
        voltage: product.voltage,
        length: product.length,
        price: product.price,
        quantity: 1
      })
    }
  }

  function updateQuantity(id, delta) {
    const item = cart.value.find((i) => i.id === id)
    if (!item) return
    item.quantity += delta
    if (item.quantity <= 0) {
      removeFromCart(id)
    }
  }

  function removeFromCart(id) {
    cart.value = cart.value.filter((i) => i.id !== id)
  }

  function clearCart() {
    cart.value = []
  }

  // Додавання індивідуального замовлення
  function addCustomOrder(orderData) {
    customOrders.value.unshift({
      id: Date.now(),
      createdAt: new Date().toLocaleString('uk-UA'),
      ...orderData
    })
  }

  function removeCustomOrder(id) {
    customOrders.value = customOrders.value.filter((o) => o.id !== id)
  }

  // Підрахунки
  const cartCount = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const cartTotal = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  return {
    products,
    isLoading,
    error,
    cart,
    customOrders,
    cartCount,
    cartTotal,
    loadProducts,
    getProductById,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    addCustomOrder,
    removeCustomOrder
  }
})