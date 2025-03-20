<template>
  <div class="contact-page">
    <div class="container">
      <h1>{{ $t('contact.title') }}</h1>
      
      <div class="contact-info">
        <div class="info-item">
          <i class="fas fa-envelope"></i>
          <h3>{{ $t('contact.email.title') }}</h3>
          <p>{{ $t('contact.email.content') }}</p>
        </div>
        
        <div class="info-item">
          <i class="fas fa-clock"></i>
          <h3>{{ $t('contact.hours.title') }}</h3>
          <p>{{ $t('contact.hours.content') }}</p>
        </div>
        
        <div class="info-item">
          <i class="fas fa-map-marker-alt"></i>
          <h3>{{ $t('contact.location.title') }}</h3>
          <p>{{ $t('contact.location.content') }}</p>
        </div>
      </div>

      <div class="contact-form">
        <h2>{{ $t('contact.form.title') }}</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">{{ $t('contact.form.name') }}</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              :placeholder="$t('contact.form.namePlaceholder')"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="email">{{ $t('contact.form.email') }}</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              :placeholder="$t('contact.form.emailPlaceholder')"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="subject">{{ $t('contact.form.subject') }}</label>
            <input 
              type="text" 
              id="subject" 
              v-model="form.subject" 
              :placeholder="$t('contact.form.subjectPlaceholder')"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="message">{{ $t('contact.form.message') }}</label>
            <textarea 
              id="message" 
              v-model="form.message" 
              :placeholder="$t('contact.form.messagePlaceholder')"
              rows="5"
              required
            ></textarea>
          </div>
          
          <button type="submit" class="submit-btn">
            {{ $t('contact.form.submit') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  },
  methods: {
    submitForm() {
      // TODO: 实现表单提交逻辑
      console.log('Form submitted:', this.form)
      // 重置表单
      this.form = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped>
.contact-page {
  padding: 40px 0;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.info-item {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.info-item:hover {
  transform: translateY(-5px);
}

.info-item i {
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 20px;
}

.info-item h3 {
  margin-bottom: 15px;
  color: #333;
}

.info-item p {
  color: #666;
  line-height: 1.6;
}

.contact-form {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-form h2 {
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #007bff;
  outline: none;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.submit-btn:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .contact-info {
    grid-template-columns: 1fr;
  }
  
  .contact-form {
    padding: 20px;
  }
}
</style> 