variable "aws_region" {
  type    = string
  default = "us-east-1"
}
variable "source_ami" {
  type    = string
  default = "ami-08c40ec9ead489470"
}
variable "ssh_username" {
  type    = string
  default = "ubuntu"
}
variable "subnet_id" {
  type    = string
  default = "subnet-0c37acf533415cc76"
}
variable "access_key" {
  type      = string
  default   = "AKIA3DNQWISQRRQITLMH"
  sensitive = true
}
variable "secret_key" {
  type      = string
  default   = "YU2dTjCZNu0FG4FJIp3p5Vnc6Rw6bbEoCX7SFo/H"
  sensitive = true
}
source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  ami_users  = ["712747046188"]
  ami_regions = [
    "us-east-1",
  ]
  aws_polling {
    delay_seconds = 30
    max_attempts  = 50
  }
  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"
  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 8
    volume_type           = "gp2"
  }
}
build {
  sources = ["source.amazon-ebs.my-ami"]
  provisioner "file" {
    source      = "a5.zip"
    destination = "~/a5.zip"
  }
  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    script = "setup.sh"
  }
}
