<template>
  <div class="privacy-page">
    <div class="container">
      <h1>{{ $t('privacy.title') }}</h1>
      
      <div class="privacy-content">
        <section class="privacy-section">
          <h2>{{ $t('privacy.sections.introduction.title') }}</h2>
          <p>{{ $t('privacy.sections.introduction.content') }}</p>
        </section>

        <section class="privacy-section">
          <h2>{{ $t('privacy.sections.dataCollection.title') }}</h2>
          <p>{{ $t('privacy.sections.dataCollection.content') }}</p>
          <ul class="privacy-list">
            <li>{{ $t('privacy.sections.dataCollection.items.personal') }}</li>
            <li>{{ $t('privacy.sections.dataCollection.items.usage') }}</li>
            <li>{{ $t('privacy.sections.dataCollection.items.cookies') }}</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>{{ $t('privacy.sections.dataUse.title') }}</h2>
          <p>{{ $t('privacy.sections.dataUse.content') }}</p>
          <ul class="privacy-list">
            <li>{{ $t('privacy.sections.dataUse.items.service') }}</li>
            <li>{{ $t('privacy.sections.dataUse.items.improvement') }}</li>
            <li>{{ $t('privacy.sections.dataUse.items.communication') }}</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>{{ $t('privacy.sections.dataSharing.title') }}</h2>
          <p>{{ $t('privacy.sections.dataSharing.content') }}</p>
        </section>

        <section class="privacy-section">
          <h2>{{ $t('privacy.sections.security.title') }}</h2>
          <p>{{ $t('privacy.sections.security.content') }}</p>
        </section>

        <section class="privacy-section">
          <h2>{{ $t('privacy.sections.cookies.title') }}</h2>
          <p>{{ $t('privacy.sections.cookies.content') }}</p>
        </section>

        <section class="privacy-section">
          <h2>{{ $t('privacy.sections.rights.title') }}</h2>
          <p>{{ $t('privacy.sections.rights.content') }}</p>
          <ul class="privacy-list">
            <li>{{ $t('privacy.sections.rights.items.access') }}</li>
            <li>{{ $t('privacy.sections.rights.items.correction') }}</li>
            <li>{{ $t('privacy.sections.rights.items.deletion') }}</li>
          </ul>
        </section>

        <section class="privacy-section">
          <h2>{{ $t('privacy.sections.changes.title') }}</h2>
          <p>{{ $t('privacy.sections.changes.content') }}</p>
        </section>
      </div>

      <div class="last-updated">
        {{ $t('privacy.lastUpdated') }}: {{ $t('privacy.updateDate') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Privacy'
}
</script>

<style scoped>
.privacy-page {
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

.privacy-content {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.privacy-section {
  margin-bottom: 30px;
}

.privacy-section:last-child {
  margin-bottom: 0;
}

.privacy-section h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.privacy-section p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.privacy-list {
  list-style-type: disc;
  margin-left: 20px;
  color: #666;
}

.privacy-list li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.last-updated {
  text-align: center;
  margin-top: 30px;
  color: #888;
  font-style: italic;
}

@media (max-width: 768px) {
  .privacy-content {
    padding: 20px;
  }
}
</style> 