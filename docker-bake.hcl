target "user-service" {
  context    = "./BackEnd/UserService"
  dockerfile = "Dockerfile"
  tags       = ["user-service:latest"]
}

target "warehouse-service" {
  context    = "./BackEnd/Warehouse"
  dockerfile = "Dockerfile"
  tags       = ["warehouse-service:latest"]
}

target "product-service" {
  context    = "./BackEnd/ProductService"
  dockerfile = "Dockerfile"
  tags       = ["product-service:latest"]
}

target "file-service" {
  context    = "./BackEnd/FileService"
  dockerfile = "Dockerfile"
  tags       = ["file-service:latest"]
}
target "authen-service" {
  context    = "./BackEnd/AuthenService"
  dockerfile = "Dockerfile"
  tags       = ["authen-service:latest"]
}
target "gateway-service" {
  context    = "./BackEnd/GatewayService"
  dockerfile = "Dockerfile"
  tags       = ["gateway-service:latest"]
}
target "order-service" {
  context    = "./BackEnd/Order"
  dockerfile = "Dockerfile"
  tags       = ["order-service:latest"]
}

target "redis-service" {
  context    = "./BackEnd/RedisService"
  dockerfile = "Dockerfile"
  tags       = ["redis-service:latest"]
}

target "inventory-service" {
  context    = "./BackEnd/InventoryService"
  dockerfile = "Dockerfile"
  tags       = ["inventory-service:latest"]
}