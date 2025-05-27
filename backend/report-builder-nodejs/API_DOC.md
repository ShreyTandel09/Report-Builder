# API Documentation: Table & Report Management

## Create Table

**POST** `/api/table/create-table/`

Request Body:

```json
{
  "tableName": "sales",
  "columns": [
    { "name": "location", "type": "VARCHAR", "length": 100, "required": true },
    { "name": "location_code", "type": "INTEGER", "required": false },
    { "name": "doc_no", "type": "INTEGER", "required": false },
    { "name": "doc_date", "type": "DATE", "required": false },
    { "name": "net_sales_qty_", "type": "BOOLEAN" }
  ]
}
```

---

## Get All Tables

**GET** `/api/report/get-table`  
Returns all table data.

---

## Get Available Fields

**GET** `/api/report/get-available-fields`  
Returns all available fields for reporting.

---

## Add Field to Table

**POST** `/api/report/add-field`

Request Body:

```json
{
  "sourceTable": "sales",
  "fieldName": "location 2",
  "fieldType": "text"
}
```

---

## Add Data to Table

**POST** `/api/table/:tableName/data`

Request Body Example:

```json
{
  "location": "USA"
}
```

---

## Update Data in Table

**PUT** `/api/table/:tableName/data/:id`

Request Body Example:

```json
{
  "location": "Amsterdam"
}
```

---

## Delete Data from Table

**DELETE** `/api/table/:tableName/data/:id`

---

## Get Data from Table

**GET** `/api/table/:tableName/data`

---

_Replace `:tableName` and `:id` with your actual table name and row ID respectively._

---

This document covers all the core endpoints for table creation, data management, and reporting fields.
