"use client"

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVillas,
  addVillaAction,
  editVillaAction,
  deleteVillaAction,
} from "../../../redux/actions/DashboardActions";
import Swal from "sweetalert2";
import "./Villa.css";
import "react-responsive-modal/styles.css";
import ClipLoader from "react-spinners/ClipLoader";
import { Modal } from "react-responsive-modal";
import { Formik, Form, Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const VillaCard = ({ villa, onEdit, onDelete }) => (
  <div className="villa-card">
    <div className="villa-top">
      <h3 className="villa-name">{villa.name}</h3>
      <button className="delete-button" onClick={() => onDelete(villa.id)}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
    <img
      src={villa.VilaImages[0].slider_image}
      alt={villa.name}
      className="villa-image"
    />
    <p className="villa-location">
      <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
      {villa.location}
    </p>
    <p className="villa-description">{villa.description.slice(0, 150)}...</p>
    <div className="villa-bottom">
      <p className="villa-price">Rp. {villa.price}</p>
      <button className="edit-button" onClick={() => onEdit(villa.id)}>
        Edit
      </button>
    </div>
  </div>
);

const VillaPage = () => {
  const dispatch = useDispatch();
  const villas = useSelector((state) => state.dashboard.villas);
  const loading = useSelector((state) => state.dashboard.loading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVilla, setEditingVilla] = useState(null);

  useEffect(() => {
    dispatch(fetchVillas());
  }, [dispatch]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVilla(null);
  };

  const handleSubmitAdd = async (values) => {
    try {
      await dispatch(addVillaAction({ ...editingVilla, ...values }));

      closeModal();

      await new Promise((resolve) => setTimeout(resolve, 0));
      Swal.fire({
        icon: "success",
        title: "Villa Added",
        text: "A new villa has been successfully added.",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Villa Addition Failed",
        text: "Failed to add the new villa. Please try again.",
      });
    }
  };

  const handleSubmitUpdate = async (values) => {
    console.log("Submitting update:", values);
    try {
      if (editingVilla) {
        dispatch(editVillaAction({ ...editingVilla, ...values }));
      }

      closeModal();
      await new Promise((resolve) => setTimeout(resolve, 0));
      Swal.fire({
        icon: "success",
        title: "Villa Edited",
        text: "The villa has been successfully edited.",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Villa Editing Failed",
        text: "Failed to edit the villa. Please try again.",
      });
    }
  };

  const handleEdit = (id) => {
    console.log("Editing villa with ID:", id);
    const villaToEdit = villas.find((villa) => villa.id === id);
    setEditingVilla(villaToEdit);
    openModal();
  };

  const handleDelete = (id) => {
    dispatch(deleteVillaAction(id));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#007bff" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="villa-page-container">
      <div className="header-container">
        <div className="header-content">
          <h1 className="header-title">Discover Luxurious Villas</h1>
          <p className="header-subtitle">
            Explore, add, edit, and delete stunning villas in our management
            system.
          </p>
          <button className="add-villa-button" onClick={openModal}>
            Add Villa
          </button>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        styles={{ modal: { width: "60%" } }}
      >
        {editingVilla ? (
          <Formik
            key={editingVilla ? editingVilla.id : "add"}
            initialValues={{
              vilaId: editingVilla.id,
              name: editingVilla.name,
              price: editingVilla.price,
              description: editingVilla.description,
              location: editingVilla.location,
              // imageUrls: editingVilla.imageUrls,
              // facilities: editingVilla.facilities,
              // longitude: editingVilla.longitude,
              // latitude: editingVilla.latitude,
            }}
            onSubmit={handleSubmitUpdate}
          >
            {({ values, setFieldValue }) => (
              // console.log("Editing villa values:", values),
              <Form className="form-villa">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="form-label">
                    Price:
                  </label>
                  <Field
                    type="text"
                    id="price"
                    name="price"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description:
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location:
                  </label>
                  <Field
                    type="text"
                    id="location"
                    name="location"
                    className="form-input"
                  />
                </div>

                {/* <div className="form-group">
                    <label htmlFor="imageUrls" className="form-label">
                      Villa Image URLs:
                    </label>
                    <Field
                      type="text"
                      id="imageUrls"
                      name="imageUrls"
                      className="form-input"
                      value={values.imageUrls}
                      onChange={(e) =>
                        setFieldValue("imageUrls", e.target.value)
                      }
                      placeholder="Enter image URLs separated by commas"
                    />
                  </div> */}

                {/* <div className="form-group">
                <label htmlFor="latitude" className="form-label">
                  Latitude:
                </label>
                <Field
                  type="text"
                  id="latitude"
                  name="latitude"
                  className="form-input"
                />
              </div> */}
                <button type="submit" className="form-submit">
                  Update Villa
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              name: "",
              price: "",
              description: "",
              location: "",
              imageUrls: "",
              facilities: [1, 2, 3],
              longitude: "",
              latitude: "",
            }}
            onSubmit={handleSubmitAdd}
          >
            {({ values, setFieldValue }) => (
              <Form className="villa-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="form-label">
                    Price:
                  </label>
                  <Field
                    type="text"
                    id="price"
                    name="price"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description:
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location:
                  </label>
                  <Field
                    type="text"
                    id="location"
                    name="location"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrls" className="form-label">
                    Villa Image URLs:
                  </label>
                  <Field
                    type="text"
                    id="imageUrls"
                    name="imageUrls"
                    className="form-input"
                    value={values.imageUrls}
                    onChange={(e) => setFieldValue("imageUrls", e.target.value)}
                    placeholder="Enter image URLs separated by commas"
                  />
                </div>

                {/* <div className="form-group">
               <label htmlFor="latitude" className="form-label">
                 Latitude:
               </label>
               <Field
                 type="text"
                 id="latitude"
                 name="latitude"
                 className="form-input"
               />
             </div> */}
                <button type="submit" className="form-submit">
                  Add Villa
                </button>
              </Form>
            )}
          </Formik>
        )}
      </Modal>

      {/* <table className="villa-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {villas.map((villa) => (
            <tr key={villa.id}>
              <td>{villa.id}</td>
              <td>{villa.name}</td>
              <td>{villa.price}</td>
              <td>{villa.description}</td>
              <td>{villa.location}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(villa.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(villa.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <div className="villa-cards-container">
        {villas.map((villa) => (
          <VillaCard
            key={villa.id}
            villa={villa}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default VillaPage;
