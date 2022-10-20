
source "amazon-ebs" "my-ami" {
  # ...
  region          = "us-east-1"
  ami_name        = "myami_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "myami"
  ami_regions = [
    "us-east-1",
  ]
  aws_polling {
    delay_seconds = 60
    max_attempts  = 10
  }
  instance_type = "t2.micro"
  source_ami    = "ami-08c40ec9ead489470"
  ssh_username  = "ubuntu"
  subnet_id     = "subnet-0c37acf533415cc76"
  ami_users= ["712747046188"]
  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 50
    volume_type           = "gp2"
  }
}

build {
  sources = [
    "source.amazon-ebs.my-ami"
  ]
  provisioner "file" {
    source      = "test.js"
    destination = "~/"
  }
  provisioner "shell" {
    script = "app.sh"
    pause_before = "10s"
    timeout = "10s"
  }
  provisioner "shell" {
    script = "mysql.sh"
    pause_before = "10s"
    timeout = "10s"
  }
    provisioner "shell" {
    script = "run.sh"
    pause_before = "10s"
    timeout = "10s"
  }

}