<script setup lang="ts">
import { ref } from 'vue'
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Upload,
} from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'

// Form data
const form = ref({
  name: '',
  price: 0,
  quantity: 0,
  image: null as File | null, // Ensure this is `File | null`
})

// Handle image file selection
const handleImageChange = (info: any) => {
  const file = info.file // Access the file directly
  if (file) {
    form.value.image = file // Save the file to form data
    message.success(`${file.name} file uploaded successfully`)
  } else {
    message.error(`${info.file.name} file upload failed.`)
  }
}

// Handle form submission
const submitForm = async () => {
  try {
    if (!form.value.image) {
      message.error('Please upload an image')
      return
    }

    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('price', form.value.price.toString())
    formData.append('quantity', form.value.quantity.toString())
    formData.append('image', form.value.image) // Ensure image is appended

    const response = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    if (result.success) {
      message.success('Product created successfully!')

      // Reset form fields
      form.value.name = ''
      form.value.price = 0
      form.value.quantity = 0
      form.value.image = null
    } else {
      throw new Error('Failed to create product')
    }
  } catch (error: any) {
    message.error(error.message || 'Failed to create product')
    console.error(error)
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <a-form @submit.prevent="submitForm" layout="vertical">
      <!-- Name Input -->
      <a-form-item label="Product Name" required>
        <a-input v-model:value="form.name" placeholder="Enter product name" />
      </a-form-item>

      <!-- Price Input -->
      <a-form-item label="Price" required>
        <a-input-number
          v-model:value="form.price"
          min="0"
          placeholder="Enter product price"
          style="width: 100%"
        />
      </a-form-item>

      <!-- Quantity Input -->
      <a-form-item label="Quantity" required>
        <a-input-number
          v-model:value="form.quantity"
          min="1"
          placeholder="Enter product quantity"
          style="width: 100%"
        />
      </a-form-item>

      <!-- Image Input -->
      <a-form-item label="Product Image" required>
        <a-upload
          name="image"
          :before-upload="() => false"
          @change="handleImageChange"
          list-type="picture"
        >
          <template #default>
            <a-button> <UploadOutlined /> Click to Upload </a-button>
          </template>
        </a-upload>
      </a-form-item>

      <!-- Submit Button -->
      <a-form-item>
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.max-w-lg {
  max-width: 600px;
}
</style>
