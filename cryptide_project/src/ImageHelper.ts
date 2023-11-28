async function loadImageAsync(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Faire quelque chose avec le blob, par exemple, créer une URL blob
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl
    } catch (error) {
      throw new Error("Erreur lors du chargement de l'image :");
    }
  }

export {loadImageAsync}