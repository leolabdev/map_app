const About = () => {

  const introduction = "Application, which may help delivery companies to plan routes around the World.";
  const planningEfficiency = "The main focus of this app is to make route planning easier for the delivery, this is why in our app routing can be made by simply providing order numbers, not just street addresses.";
  const routingDescription = "Then based on order information or more precisely on shipment and delivery addresses, the application will calculate the best possible route. This route is optimized and addresses visiting order is taken into account, since shipment address should be visited first and only after that delivery.";
  const additionalSettings = "The application also offers such great additional settings as avoiding city centers option and taking into account real-time traffic situation (Finland only).";
  const technologiesDescription = "The application uses different tools and engines for providing that functionality which are the Open route service (routing), Vroom project (optimization) and the Trafi API (traffic situation).";

  return (
      <div>
        <p>{introduction}</p>
        <p>{planningEfficiency}</p>
        <p>{routingDescription}</p>
        <p>{additionalSettings}</p>
        <p>{technologiesDescription}</p>
      </div>
  )
}
export default About;