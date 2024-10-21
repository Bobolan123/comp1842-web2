<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Button,
  message,
} from 'ant-design-vue'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'

// Define a Product interface
interface Product {
  _id: string
  name: string
  price: number
  quantity: number
  image: File | null
  deleteAt: Date | null
}

// Modal state
const open = ref<boolean>(false)

// Form data for the modal
const form = ref<Product>({
  _id: '',
  name: '',
  price: 0,
  quantity: 0,
  image: null,
  deleteAt: null,
})

// Products list
const products = ref<Product[]>([])

// Function to fetch products from API
const fetchProducts = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/products`)
    const result = await response.json()
    if (result.success) {
      products.value = result.data as Product[]
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

// Fetch products when component is mounted
onMounted(fetchProducts)

// Function to open modal
const showModal = (product: Product) => {
  form.value = { ...product }
  console.log('product', form.value)
  open.value = true
}

// Function to handle form submit
const handleOk = async (id: string) => {
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

    const response = await fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'PUT',
      body: formData,
    })
    const result = await response.json()
    if (result.success) {
      message.success('Product created successfully!')

      // Reset form fields
      form.value.name = ''
      form.value.price = 0
      form.value.quantity = 0
      // form.value.image = null
    } else {
      throw new Error('Failed to update product')
    }
  } catch (error: any) {
    message.error(error.message || 'Failed to update product')
    console.error(error)
  }
}

// Function to reset form when modal closes
const handleCancel = () => {
  form.value = {
    _id: '',
    name: '',
    price: 0,
    quantity: 0,
    image: null,
    deleteAt: null,
  }
  open.value = false
}

const handleDeleteProduct = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'DELETE',
    })
    await response.json()
    message.success(`Delete product successfully`)
    fetchProducts() // Refresh products list
  } catch (error: any) {
    message.error(error)
  }
}

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
</script>

<template>
  <div class="grid grid-cols-3 gap-6">
    <!-- Loop through each product and display only if deleteAt is null -->
    <div
      v-for="product in products"
      :key="product._id"
      class="p-4 rounded-xl shadow-xl"
    >
      <img
        class="rounded-xl w-full h-52"
        :src="`http://localhost:3001/products/${product.image}`"
        alt="Product Image"
      />
      <hr class="h-px my-3 bg-gray-200 border-0 dark:bg-gray-300" />
      <h5 class="font-bold mt-2">{{ product.name }}</h5>
      <h6 class="">${{ product.price }}</h6>
      <p class="items-center">Quantity: {{ product.quantity }}</p>
      <div class="mt-4 gap-2 flex">
        <Button
          type="primary"
          @click="showModal(product)"
          class="flex items-center"
        >
          Edit Product
          <EditOutlined />
        </Button>
        <Button
          type="primary"
          danger
          @click="handleDeleteProduct(product._id)"
          class="flex items-center"
        >
          Delete
          <DeleteOutlined />
        </Button>
      </div>
    </div>
  </div>

  <!-- Modal for form -->
  <Modal
    v-model:visible="open"
    title="Edit Product"
    @ok="handleOk(form._id)"
    @cancel="handleCancel"
  >
    <Form layout="vertical">
      <!-- Name input -->
      <Form.Item label="Product Name" required>
        <Input v-model:value="form.name" placeholder="Enter product name" />
      </Form.Item>

      <!-- Price input -->
      <Form.Item label="Price" required>
        <InputNumber
          v-model:value="form.price"
          placeholder="Enter price"
          style="width: 100%"
        />
      </Form.Item>

      <!-- Quantity input -->
      <Form.Item label="Quantity" required>
        <InputNumber
          v-model:value="form.quantity"
          placeholder="Enter quantity"
          style="width: 100%"
        />
      </Form.Item>

      <!-- Image URL input -->
      <Form.Item label="Image URL" required>
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
      </Form.Item>
    </Form>
  </Modal>
</template>

<style scoped>
/* Additional styles for better alignment if needed */
</style>
