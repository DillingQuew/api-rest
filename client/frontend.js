import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js' //импорт фреймворка



const app = createApp({ //создание экземпляра приложения
  data() { //возвращаемые данные
    return {
      loading: false,
      form: {
        name: '',
        value: '',
      },
      contacts: []
    }
  },
  computed: {
    canCreate() {
      return this.form.value.trim() && this.form.name.trim()
    }
  },
  methods: { //собственные методы, вызываемые в верстке в качестве атрибутов
    async createContact() {
      const {...contact} = this.form; //деструктиризация формы
      const newContact = await request('/api/contacts', 'POST', contact)
      this.contacts.push(newContact); //запись данных с формы в массив с уникальным ключом
      this.form.name = this.form.value = ''; //очистка полей форм после отправки данных
    },
    async markContact(id) {
      const contact = this.contacts.find( c => c.id === id)
      const updated =   await request(`/api/contacts/${id}`, 'PUT', {
        ...contact,
        marked: true
      })
      contact.marked = updated.marked;
    },
    async removeContact(id) {
        await request(`/api/contacts/${id}`, 'DELETE')
        this.contacts = this.contacts.filter(c => c.id !== id)
    }
  },
  async mounted() {
    this.loading = true
    this.contacts = await request('/api/contacts')
    this.loading = false
  }
});

app.component('loader', {
  template: `
  <div style="display: flex; justify-content:center; align-items:center" class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  `
})

async function request(url, method = "GET", data = null) {
  try {
    const headers = {}
    let body
    if (data) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data)
    }
    const response = await fetch(url, {
      method,
      headers,
      body
    })
    return await response.json()
  } catch (e) {
    console.warn('Error:', e.message)
  }
}

app.mount('#app'); //отрисовка компонента