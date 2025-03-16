function Button({ url, altText }) {
  return (
    <a href={url} className="bg-gray-500 rounded-2xl p-2">
      {altText || "Botón"}
    </a>
  );
}

export default Button;
