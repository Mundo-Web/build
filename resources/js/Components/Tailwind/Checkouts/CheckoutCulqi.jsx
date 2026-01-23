import React from "react"

const CheckoutCulqi = ({ data }) => {
  return <div id={data?.element_id || null} class="flex flex-col gap-8">

    <input type="hidden" name="_token" value="KetUXGJHlBNXwBFdNlcg8R9ueYHpfGMUECXmlNyQ" autocomplete="off" />
    <div class="flex flex-col gap-5 pb-10 border-b-2 border-gray-200 dark:border-gray-700">
      <h2 class="font-semibold text-[20px] text-[#151515]">
        Información del contacto
      </h2>
      <div class="flex flex-col gap-5">
        <div class="flex flex-col md:flex-row gap-5">
          <div class="basis-2/3 flex flex-col gap-2">
            <label for="email" class="font-medium text-[12px] text-[#6C7275]">E-mail <span class="text-red-500">*</span></label>
            <input id="email" type="email" placeholder="Correo electrónico" required="" name="email" value="" class="w-full py-3 px-4 focus:outline-none placeholder-gray-400 font-normal text-[16px] border-[1.5px] border-gray-200 rounded-xl text-[#6C7275]" />
          </div>
          <div class="basis-1/3 flex flex-col gap-2">
            <label for="celular" class="font-medium text-[12px] text-[#6C7275]">Celular <span class="text-red-500">*</span></label>
            <input id="celular" type="text" placeholder="(+51) 000 000 000" name="phone" value="" class="w-full py-3 px-4 focus:outline-none placeholder-gray-400 font-normal text-[16px] border-[1.5px] border-gray-200 rounded-xl" required="" />
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-5">
          <div class="basis-1/2 flex flex-col gap-2">
            <label for="nombre" class="font-medium text-[12px] text-[#6C7275]">Nombre <span class="text-red-500">*</span></label>
            <input id="nombre" type="text" placeholder="Nombre" name="nombre" value="" class="w-full py-3 px-4 focus:outline-none placeholder-gray-400 font-normal text-[16px] border-[1.5px] border-gray-200 rounded-xl text-[#6C7275]" required="" />
          </div>
          <div class="basis-1/2 flex flex-col gap-2">
            <label for="apellidos" class="font-medium text-[12px] text-[#6C7275]">Apellido <span class="text-red-500">*</span></label>
            <input id="apellidos" type="text" placeholder="Apellido" name="apellidos" value="" class="w-full py-3 px-4 focus:outline-none placeholder-gray-400 font-normal text-[16px] border-[1.5px] border-gray-200 rounded-xl text-[#6C7275]" required="" />

          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-5 pb-10 w-full">
      <h2 class="font-semibold text-[20px] text-[#151515]">
        Dirección de envío
      </h2>
      <ul class="grid w-full gap-6 md:grid-cols-3">
        <li>
          <input type="radio" name="envio" id="recoger-option" value="recoger" class="hidden peer" required="" checked="" />
          <label for="recoger-option" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-3 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-[#74A68D] hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="block">
              <svg class="w-6 h-6 mb-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z">
                </path>
              </svg>

              <div class="w-full text-lg font-semibold">Recojo en tienda</div>
              <div class="w-full text-sm">Envio gratis</div>
            </div>
          </label>
        </li>
        <li>
          <input type="radio" name="envio" id="express-option" value="express" class="hidden peer" />
          <label for="express-option" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-3 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-[#74A68D] hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="block">
              <svg class="w-6 h-6 mb-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 21v-9m3-4H7.5a2.5 2.5 0 1 1 0-5c1.5 0 2.875 1.25 3.875 2.5M14 21v-9m-9 0h14v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8ZM4 8h16a1 1 0 0 1 1 1v3H3V9a1 1 0 0 1 1-1Zm12.155-5c-3 0-5.5 5-5.5 5h5.5a2.5 2.5 0 0 0 0-5Z">
                </path>
              </svg>

              <div class="w-full text-lg font-semibold">Envio express</div>
              <div class="w-full text-sm">Sujeto a evaluacion</div>
            </div>
          </label>
        </li>
      </ul>
      <div id="direccionContainer" class="flex flex-col gap-5" style={{ display: 'none' }}>
        <div class="flex flex-col gap-5">
          <div data-show="new" class="flex flex-col gap-5 md:flex-row">
            <div class="basis-1/3 flex flex-col gap-2 z-[45]">
              <label class="font-medium text-[12px] text-[#6C7275]">Departamento <span class="text-red-500">*</span></label>

              <div>
                <div class="dropdown w-full">
                  <select name="departamento_id" id="departamento_id" class="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select2-hidden-accessible" data-address="" data-select2-id="select2-data-departamento_id" tabindex="-1" aria-hidden="true">
                    <option value="" data-select2-id="select2-data-2-4o85">Seleccione un
                      departamento</option>
                  </select><span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="select2-data-1-qxzf" style={{ width: '1px' }}><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-departamento_id-container" aria-controls="select2-departamento_id-container"><span class="select2-selection__rendered" id="select2-departamento_id-container" role="textbox" aria-readonly="true" title="Seleccione un
                                    departamento">Seleccione un
                    departamento</span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                </div>
              </div>
            </div>

            <div class="basis-1/3 flex flex-col gap-2 z-[40]">
              <label class="font-medium text-[12px] text-[#6C7275]">
                Provincia <span class="text-red-500">*</span>
              </label>

              <div>
                <div class="dropdown-provincia w-full">
                  <select name="provincia_id" id="provincia_id" class="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select2-hidden-accessible" data-address="" data-select2-id="select2-data-provincia_id" tabindex="-1" aria-hidden="true">
                    <option value="" data-select2-id="select2-data-4-gokf">Seleccione una
                      provincia
                    </option>

                  </select><span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="select2-data-2-kz33" style={{ width: '1px' }}><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-provincia_id-container" aria-controls="select2-provincia_id-container"><span class="select2-selection__rendered" id="select2-provincia_id-container" role="textbox" aria-readonly="true" title="Seleccione una
                                    provincia
                                  ">Seleccione una
                    provincia
                  </span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                </div>
              </div>
            </div>

            <div class="basis-1/3 flex flex-col gap-2 z-[30]">
              <label class="font-medium text-[12px] text-[#6C7275]">
                Distrito <span class="text-red-500">*</span>
              </label>

              <div>
                <div class="dropdown-distrito w-full">
                  <select name="distrito_id" id="distrito_id" class="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 select2-hidden-accessible" data-address="" data-select2-id="select2-data-distrito_id" tabindex="-1" aria-hidden="true">
                    <option value="" data-select2-id="select2-data-6-ihrp">Seleccione un distrito
                    </option>
                  </select><span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="select2-data-3-q24m" style={{ width: '1px' }}><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-distrito_id-container" aria-controls="select2-distrito_id-container"><span class="select2-selection__rendered" id="select2-distrito_id-container" role="textbox" aria-readonly="true" title="Seleccione un distrito
                                  ">Seleccione un distrito
                  </span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                </div>
              </div>
            </div>
          </div>

          <div data-show="new" class="flex flex-col gap-2">
            <label for="nombre_calle" class="font-medium text-[12px] text-[#6C7275]">Avenida / Calle /
              Jirón <span class="text-red-500">*</span></label>

            <input id="nombre_calle" type="text" name="dir_av_calle" placeholder="Ingresa el nombre de la calle" class="w-full py-3 px-4 focus:outline-none placeholder-gray-400 font-normal text-[16px] border-[1.5px] border-gray-200 rounded-xl text-[#6C7275]" data-address="" />
          </div>
        </div>
        <div>
          <div data-show="new" class="flex flex-col md:flex-row gap-5">
            <div class="basis-1/2 flex flex-col gap-2">
              <label for="numero_calle" class="font-medium text-[12px] text-[#6C7275]">Número <span class="text-red-500">*</span></label>
              <input id="numero_calle" name="dir_numero" type="text" placeholder="Ingresa el número de la callle" class="w-full py-3 px-4 focus:outline-none placeholder-gray-400 font-normal text-[16px] border-[1.5px] border-gray-200 rounded-xl text-[#6C7275]" data-address="" />
            </div>

            <div class="basis-1/2 flex flex-col gap-2">
              <label for="direccion" class="font-medium text-[12px] text-[#6C7275]">Dpto./ Interior/
                Piso/
                Lote/ Bloque
                (opcional)</label>
              <input id="direccion" type="text" name="dir_bloq_lote" placeholder="Ejem. Casa 3, Dpto 101" class="w-full py-3 px-4 focus:outline-none placeholder-gray-400 font-normal text-[16px] border-[1.5px] border-gray-200 rounded-xl text-[#6C7275]" />
            </div>
          </div>
        </div>
      </div>
    </div>



  </div>
}

export default CheckoutCulqi