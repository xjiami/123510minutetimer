<template>
  <div class="privacy-page">
    <div class="container">
      <h1 class="page-title">{{ $t('footer.privacy') }}</h1>
      
      <div class="privacy-content card">
        <div class="last-updated">
          <p>{{ $t('privacy.lastUpdated') }}: {{ $t('privacy.date') }}</p>
        </div>
        
        <div class="privacy-section">
          <h2>1. {{ $t('privacy.introduction') }}</h2>
          <p>{{ $t('privacy.introductionText1') }}</p>
          <p>{{ $t('privacy.introductionText2') }}</p>
        </div>
        
        <div class="privacy-section">
          <h2>2. {{ $t('privacy.information') }}</h2>
          <p>{{ $t('privacy.informationText') }}</p>
          <ul>
            <li>{{ $t('privacy.informationItem1') }}</li>
            <li>{{ $t('privacy.informationItem2') }}</li>
            <li>{{ $t('privacy.informationItem3') }}</li>
            <li>{{ $t('privacy.informationItem4') }}</li>
          </ul>
        </div>
        
        <div class="privacy-section">
          <h2>3. {{ $t('privacy.usage') }}</h2>
          <p>{{ $t('privacy.usageText') }}</p>
          <ul>
            <li>{{ $t('privacy.usageItem1') }}</li>
            <li>{{ $t('privacy.usageItem2') }}</li>
            <li>{{ $t('privacy.usageItem3') }}</li>
            <li>{{ $t('privacy.usageItem4') }}</li>
          </ul>
        </div>
        
        <div class="privacy-section">
          <h2>4. {{ $t('privacy.cookies') }}</h2>
          <p>{{ $t('privacy.cookiesText1') }}</p>
          <p>{{ $t('privacy.cookiesText2') }}</p>
        </div>
        
        <div class="privacy-section">
          <h2>5. {{ $t('privacy.thirdParty') }}</h2>
          <p>{{ $t('privacy.thirdPartyText1') }}</p>
          <p>{{ $t('privacy.thirdPartyText2') }}</p>
        </div>
        
        <div class="privacy-section">
          <h2>6. {{ $t('privacy.security') }}</h2>
          <p>{{ $t('privacy.securityText1') }}</p>
          <p>{{ $t('privacy.securityText2') }}</p>
        </div>
        
        <div class="privacy-section">
          <h2>7. {{ $t('privacy.children') }}</h2>
          <p>{{ $t('privacy.childrenText') }}</p>
        </div>
        
        <div class="privacy-section">
          <h2>8. {{ $t('privacy.changes') }}</h2>
          <p>{{ $t('privacy.changesText') }}</p>
        </div>
        
        <div class="privacy-section">
          <h2>9. {{ $t('privacy.contact') }}</h2>
          <p>{{ $t('privacy.contactText') }} <a href="mailto:xjiami135@gmail.com">xjiami135@gmail.com</a>.</p>
        </div>
        
        <div class="privacy-section">
          <h2>10. {{ $t('privacy.rights') }}</h2>
          <p>{{ $t('privacy.rightsText1') }}</p>
          <p>{{ $t('privacy.rightsText2') }}</p>
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
  document.title = t('footer.privacy') + ' | 123510 Minute Timer';
  
  // 更新meta描述
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  
  metaDescription.setAttribute('content', t('privacy.metaDescription'));
});
</script>

<style scoped>
.privacy-page {
  padding: 3rem 0;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-size: 2.5rem;
}

.privacy-content {
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

.privacy-section {
  margin-bottom: 2.5rem;
}

.privacy-section h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.privacy-section p {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.privacy-section ul {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.privacy-section li {
  margin-bottom: 0.5rem;
  line-height: 1.7;
}

.privacy-section a {
  color: var(--primary-color);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .privacy-page {
    padding: 2rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .privacy-content {
    padding: 1.5rem;
  }
}
</style> 