<template>
  <div class="terms-page">
    <div class="container">
      <h1 class="page-title">{{ $t('footer.terms') }}</h1>
      
      <div class="terms-content card">
        <div class="last-updated">
          <p>{{ $t('terms.lastUpdated') }}: {{ $t('terms.date') }}</p>
        </div>
        
        <div class="terms-section">
          <h2>1. {{ $t('terms.acceptance') }}</h2>
          <p>{{ $t('terms.acceptanceText1') }}</p>
          <p>{{ $t('terms.acceptanceText2') }}</p>
        </div>
        
        <div class="terms-section">
          <h2>2. {{ $t('terms.description') }}</h2>
          <p>{{ $t('terms.descriptionText') }}</p>
        </div>
        
        <div class="terms-section">
          <h2>3. {{ $t('terms.accounts') }}</h2>
          <p>{{ $t('terms.accountsText1') }}</p>
          <p>{{ $t('terms.accountsText2') }}</p>
        </div>
        
        <div class="terms-section">
          <h2>4. {{ $t('terms.usage') }}</h2>
          <p>{{ $t('terms.usageText1') }}</p>
          <p>{{ $t('terms.usageText2') }}</p>
          <ul>
            <li>{{ $t('terms.usageListItem1') }}</li>
            <li>{{ $t('terms.usageListItem2') }}</li>
            <li>{{ $t('terms.usageListItem3') }}</li>
            <li>{{ $t('terms.usageListItem4') }}</li>
          </ul>
        </div>
        
        <div class="terms-section">
          <h2>5. {{ $t('terms.intellectual') }}</h2>
          <p>{{ $t('terms.intellectualText1') }}</p>
          <p>{{ $t('terms.intellectualText2') }}</p>
        </div>
        
        <div class="terms-section">
          <h2>6. {{ $t('terms.disclaimer') }}</h2>
          <p>{{ $t('terms.disclaimerText1') }}</p>
          <p>{{ $t('terms.disclaimerText2') }}</p>
        </div>
        
        <div class="terms-section">
          <h2>7. {{ $t('terms.limitation') }}</h2>
          <p>{{ $t('terms.limitationText') }}</p>
        </div>
        
        <div class="terms-section">
          <h2>8. {{ $t('terms.changes') }}</h2>
          <p>{{ $t('terms.changesText') }}</p>
        </div>
        
        <div class="terms-section">
          <h2>9. {{ $t('terms.contact') }}</h2>
          <p>{{ $t('terms.contactText') }} <a href="mailto:xjiami135@gmail.com">xjiami135@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

onMounted(() => {
  // SEO优化
  document.title = t('footer.terms') + ' | 123510 Minute Timer';
  
  // 更新meta描述
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  
  metaDescription.setAttribute('content', t('terms.metaDescription'));
});
</script>

<style scoped>
.terms-page {
  padding: 3rem 0;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-size: 2.5rem;
}

.terms-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem;
}

.last-updated {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--gray);
  font-style: italic;
}

.terms-section {
  margin-bottom: 2.5rem;
}

.terms-section h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.terms-section p {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.terms-section ul {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.terms-section li {
  margin-bottom: 0.5rem;
  line-height: 1.7;
}

.terms-section a {
  color: var(--primary-color);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .terms-page {
    padding: 2rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .terms-content {
    padding: 1.5rem;
  }
}
</style> 