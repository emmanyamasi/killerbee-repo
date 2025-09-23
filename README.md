KillerBee Information System (FreezeBee Management Project)

This project is developed as part of Phase 1 – Design and Implementation of the KillerBee Information System.
The goal is to computerize KillerBee’s FreezeBee manufacturing process, replacing paper records with a secure web-based management system.

🎯 Project Purpose

KillerBee currently stores manufacturing procedures and ingredient lists on paper.
This project builds a web application and supporting infrastructure to manage:

Models (FreezeBee types, ranges, descriptions)

Ingredients (names, descriptions, weights)

Manufacturing processes (steps, validations, tests)

All communication follows Zero Trust principles and is encrypted. Authentication is managed through Active Directory.

🏗 Architecture Overview

The system consists of:

Frontend (Angular) → user interface for employees

Backend API (Express.js) → API gateway + business logic

Microservices → catalog (models & ingredients) and process (processes & tests)

Database (SQL Server) → relational storage with schemas for R&D, testing, and production

Infrastructure → Proxmox virtualization, Linux file server, Stormshield firewall, Cisco switches