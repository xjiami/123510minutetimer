<template>
  <div class="contact-page">
    <div class="container">
      <h1 class="page-title">{{ $t('footer.contact') }}</h1>
      
      <div class="contact-content">
        <div class="contact-info card">
          <h2>{{ $t('contact.getInTouch') }}</h2>
          <p>{{ $t('contact.description') }}</p>
          
          <div class="contact-methods">
            <div class="contact-method">
              <div class="contact-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="contact-details">
                <h3>{{ $t('contact.email') }}</h3>
                <p><a href="mailto:xjiami135@gmail.com">xjiami135@gmail.com</a></p>
              </div>
            </div>
            
            <div class="contact-method">
              <div class="contact-icon">
                <i class="fas fa-comments"></i>
              </div>
              <div class="contact-details">
                <h3>{{ $t('contact.social') }}</h3>
                <div class="social-links">
                  <a href="https://twitter.com/123510timer" target="_blank" rel="noopener" class="social-link">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="https://facebook.com/123510timer" target="_blank" rel="noopener" class="social-link">
                    <i class="fab fa-facebook"></i>
                  </a>
                  <a href="https://instagram.com/123510timer" target="_blank" rel="noopener" class="social-link">
                    <i class="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="contact-form card">
          <h2>{{ $t('contact.sendMessage') }}</h2>
          
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">{{ $t('contact.name') }}</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name" 
                :placeholder="$t('contact.namePlaceholder')"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="email">{{ $t('contact.emailAddress') }}</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                :placeholder="$t('contact.emailPlaceholder')"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="subject">{{ $t('contact.subject') }}</label>
              <input 
                type="text" 
                id="subject" 
                v-model="form.subject" 
                :placeholder="$t('contact.subjectPlaceholder')"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="message">{{ $t('contact.message') }}</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                :placeholder="$t('contact.messagePlaceholder')"
                rows="5"
                required
              ></textarea>
            </div>
            
            <button type="submit" class="btn btn-large" :disabled="isSubmitting">
              <span v-if="isSubmitting">{{ $t('contact.sending') }}</span>
              <span v-else>{{ $t('contact.send') }}</span>
            </button>
          </form>
          
          <div v-if="formSubmitted" class="form-success">
            <i class="fas fa-check-circle"></i>
            <p>{{ $t('contact.thankYou') }}</p>
          </div>
        </div>
      </div>
      
      <div class="faq-section card">
        <h2>{{ $t('contact.faq') }}</h2>
        
        <div class="faq-list">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="faq-item"
            :class="{ 'active': activeFaq === index }"
          >
            <div class="faq-question" @click="toggleFaq(index)">
              <h3>{{ $t(faq.question) }}</h3>
              <span class="faq-toggle">
                <i :class="['fas', activeFaq === index ? 'fa-minus' : 'fa-plus']"></i>
              </span>
            </div>
            <div class="faq-answer" v-show="activeFaq === index">
              <p>{{ $t(faq.answer) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 表单数据
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

// 表单状态
const isSubmitting = ref(false);
const formSubmitted = ref(false);

// 提交表单
const submitForm = () => {
  isSubmitting.value = true;
  
  // 模拟表单提交
  setTimeout(() => {
    isSubmitting.value = false;
    formSubmitted.value = true;
    
    // 重置表单
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    
    // 一段时间后隐藏成功消息
    setTimeout(() => {
      formSubmitted.value = false;
    }, 5000);
  }, 1500);
};

// 常见问题
const faqs = [
  {
    question: 'contact.faq1.question',
    answer: 'contact.faq1.answer'
  },
  {
    question: 'contact.faq2.question',
    answer: 'contact.faq2.answer'
  },
  {
    question: 'contact.faq3.question',
    answer: 'contact.faq3.answer'
  },
  {
    question: 'contact.faq4.question',
    answer: 'contact.faq4.answer'
  }
];

// 当前激活的FAQ
const activeFaq = ref(null);

// 切换FAQ
const toggleFaq = (index) => {
  if (activeFaq.value === index) {
    activeFaq.value = null;
  } else {
    activeFaq.value = index;
  }
};
</script>

<style scoped>
.contact-page {
  padding: 3rem 0;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-size: 2.5rem;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.contact-info,
.contact-form {
  height: 100%;
}

.contact-methods {
  margin-top: 2rem;
}

.contact-method {
  display: flex;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.contact-method:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.contact-icon {
  width: 50px;
  height: 50px;
  background-color: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.contact-icon i {
  font-size: 1.5rem;
  color: var(--white);
}

.contact-details h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.contact-details p {
  margin-bottom: 0.5rem;
  color: var(--gray);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background-color: var(--bg-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.social-link:hover {
  background-color: var(--primary-color);
  color: var(--white);
  transform: translateY(-3px);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark-gray);
}

.form-success {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: var(--success-color);
  color: var(--white);
  border-radius: var(--border-radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.form-success i {
  font-size: 1.5rem;
}

.form-success p {
  margin: 0;
}

.faq-section {
  margin-top: 3rem;
}

.faq-list {
  margin-top: 1.5rem;
}

.faq-item {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-medium);
  margin-bottom: 1rem;
  overflow: hidden;
}

.faq-question {
  padding: 1rem 1.5rem;
  background-color: var(--bg-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.faq-item.active .faq-question,
.faq-question:hover {
  background-color: var(--primary-light);
  color: var(--white);
}

.faq-question h3 {
  margin: 0;
  font-size: 1.1rem;
}

.faq-toggle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--white);
  border-radius: 50%;
  color: var(--primary-color);
  font-size: 0.8rem;
}

.faq-answer {
  padding: 1rem 1.5rem;
  background-color: var(--white);
  border-top: 1px solid var(--border-color);
}

.faq-answer p {
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 992px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contact-page {
    padding: 2rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style> 