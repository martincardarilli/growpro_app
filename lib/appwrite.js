import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.grow.pro",
  projectId: "66b52a1900120b05a758",
  storageId: "66b52c4e00198e3902c1",
  databaseId: "66b52af30037a607d977",
  userCollectionId: "66b52b0c002342952bba",
  videoCollectionId: "66b52b350029c3bd14d4",
  //nuevos
  automatizacionesCollectionId: "66f86e7f00259ce236a7",
  devicesCollectionId: "66f9f6c600186f9e6cd7",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    console.log("Obteniendo la cuenta del usuario...");
    const currentAccount = await account.get();
    console.log("Cuenta obtenida:", currentAccount);
    return currentAccount;
  } catch (error) {
    console.error("Error al obtener la cuenta:", error.message);
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// -----------------------------------------------------------------------------------------
// AUTOMATIZACIONES
// -----------------------------------------------------------------------------------------

// Obtener todas las automatizaciones con el dispositivo asociado
// Obtener todas las automatizaciones con el dispositivo asociado
// -----------------------------------------------------------------------------------------
// AUTOMATIZACIONES
// -----------------------------------------------------------------------------------------

export async function getAllAutomatizaciones() {
  try {
    // Paso 1: Obtener todas las automatizaciones
    const automatizaciones = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.automatizacionesCollectionId
    );

    // Si no hay automatizaciones, devolver un array vacío
    if (!automatizaciones.documents.length) {
      return [];
    }

    // Paso 2: Devolver directamente los documentos sin modificar
    return automatizaciones.documents;
  } catch (error) {
    console.error('Error fetching automatizaciones with devices:', error);
    throw new Error(error);
  }
}





export async function getUserAutomatizaciones(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.automatizacionesCollectionId[
      Query.equal("creator", userId)
      ]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// CREATE
// CREATE
// Crear automatización y asociarla al dispositivo por su ID
export async function postAutomatizacion(form) {
  try {
    // Aquí usaremos la MAC con los dos puntos para buscar el dispositivo
    const macWithColons = form.device;

    console.log("Buscando dispositivo con MAC:", macWithColons);

    // Buscamos el dispositivo en la colección `devices` usando el campo `MAC` (con los dos puntos)
    const devices = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.devicesCollectionId,
      [Query.equal("MAC", macWithColons)] // Buscar por el campo MAC que contiene la versión con ":"
    );

    console.log("Dispositivos encontrados:", devices.documents);

    // Si no se encuentra ningún dispositivo, lanzamos un error
    if (devices.documents.length === 0) {
      throw new Error('Dispositivo no encontrado');
    }

    // Obtenemos el ID normalizado del dispositivo (la MAC sin los dos puntos)
    const deviceId = devices.documents[0].$id;

    // Creamos la automatización y asociamos el dispositivo por su ID
    const newAutomatizacion = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.automatizacionesCollectionId,
      ID.unique(),
      {
        titulo: form.titulo,
        descripcion: form.descripcion,
        device: deviceId, // Asociamos el ID del dispositivo (la MAC normalizada)
        switch: form.switch,
        config: JSON.stringify(form.config),
        userId: form.userId, // Asociamos el usuario si es necesario
      }
    );

    return newAutomatizacion;
  } catch (error) {
    console.error("Error creando la automatización:", error);
    throw new Error(error);
  }
}

// -----------------------------------------------------------------------------------------
// AUTOMATIZACIONES
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// DEVICES
// -----------------------------------------------------------------------------------------
export async function getAllDevices() {
  try {
    const devices = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.devicesCollectionId
    );

    return devices.documents;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Update fields for a specific device.
 * @param {string} deviceId - The ID of the device document to update.
 * @param {Object} data - The fields to update in the device document.
 * @returns {Promise} - A promise that resolves with the updated device document.
 */
export async function updateDevice(deviceId, data) {
  try {
    const updatedDevice = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.devicesCollectionId,
      deviceId,
      data
    );
    return updatedDevice;
  } catch (error) {
    console.error("Error updating device:", error);
    throw new Error(error);
  }
}


export async function createDevice(deviceData) {
  const { macAddress, model, status, ip, name } = deviceData;

  // Normalizar la MAC address eliminando los dos puntos
  const normalizedMacAddress = macAddress.replace(/:/g, '');

  try {
    const newDevice = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.devicesCollectionId,
      normalizedMacAddress, // Usamos la MAC address sin los dos puntos como ID
      {
        model: model,
        MAC: macAddress, // Guardamos la MAC original con los dos puntos
        status: JSON.stringify(status),
        ip: ip,
        name: name,
      }
    );

    return newDevice;
  } catch (error) {
    console.error("Error creating device:", error);
    throw new Error(error);
  }
}

// -----------------------------------------------------------------------------------------
// DEVICES
// -----------------------------------------------------------------------------------------