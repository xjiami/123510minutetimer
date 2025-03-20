<template>
  <div class="terms-page">
    <div class="container">
      <h1>{{ $t('terms.title') }}</h1>
      
      <div class="terms-content">
        <section class="terms-section">
          <h2>{{ $t('terms.sections.introduction.title') }}</h2>
          <p>{{ $t('terms.sections.introduction.content') }}</p>
        </section>

        <section class="terms-section">
          <h2>{{ $t('terms.sections.definitions.title') }}</h2>
          <p>{{ $t('terms.sections.definitions.content') }}</p>
        </section>

        <section class="terms-section">
          <h2>{{ $t('terms.sections.usage.title') }}</h2>
          <p>{{ $t('terms.sections.usage.content') }}</p>
        </section>

        <section class="terms-section">
          <h2>{{ $t('terms.sections.accounts.title') }}</h2>
          <p>{{ $t('terms.sections.accounts.content') }}</p>
        </section>

        <section class="terms-section">
          <h2>{{ $t('terms.sections.privacy.title') }}</h2>
          <p>{{ $t('terms.sections.privacy.content') }}</p>
        </section>

        <section class="terms-section">
          <h2>{{ $t('terms.sections.termination.title') }}</h2>
          <p>{{ $t('terms.sections.termination.content') }}</p>
        </section>

        <section class="terms-section">
          <h2>{{ $t('terms.sections.changes.title') }}</h2>
          <p>{{ $t('terms.sections.changes.content') }}</p>
        </section>
      </div>

      <div class="last-updated">
        {{ $t('terms.lastUpdated') }}: {{ $t('terms.updateDate') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Terms'
}
</script>

<style scoped>
.terms-page {
  padding: 40px 0;
  background-color: #f8f9fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.terms-content {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.terms-section {
  margin-bottom: 30px;
}

.terms-section:last-child {
  margin-bottom: 0;
}

.terms-section h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.terms-section p {
  color: #666;
  line-height: 1.6;
}

.last-updated {
  text-align: center;
  margin-top: 30px;
  color: #888;
  font-style: italic;
}

@media (max-width: 768px) {
  .terms-content {
    padding: 20px;
  }
}
</style> 