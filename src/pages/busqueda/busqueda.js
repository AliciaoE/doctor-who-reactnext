import React from 'react';
import Layout from '../../app/Layout';
import DoctorList from '../../components/DoctorList';
import path from 'path';
import fs from 'fs/promises';
import styles from './busqueda.module.css'; 


const Busqueda = ({ searchResults }) => {
  return (
    <Layout>
      <div>
        <h1 className={styles.tituloBusqueda}>Doctores</h1>
        {searchResults && searchResults.length > 0 ? (
          <DoctorList doctorsData={{ doctors: searchResults }} />
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ query }) {
  const searchTerm = query.searchTerm || '';

  try {
    // Obtén la ruta completa al archivo JSON
    const filePath = path.join(process.cwd(), 'public', 'data', 'doctors.json');
    
    // Lee el contenido del archivo
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Parsea el contenido como JSON
    const doctors = JSON.parse(fileContent);

    // Filtra los doctores según el término de búsqueda
    const filteredDoctors = doctors.doctors.filter((doctor) =>
      doctor.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.actor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      props: {
        searchResults: filteredDoctors,
      },
    };
  } catch (error) {
    console.error('Error loading doctors:', error);

    return {
      props: {
        searchResults: [],
      },
    };
  }
}

export default Busqueda;
