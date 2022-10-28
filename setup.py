from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in appointment_booking/__init__.py
from appointment_booking import __version__ as version

setup(
	name="appointment_booking",
	version=version,
	description="Book an appointment and pay with flutterwave",
	author="ErpChampions",
	author_email="zubairmazhar23@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
